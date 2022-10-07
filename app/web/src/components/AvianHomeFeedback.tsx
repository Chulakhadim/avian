import { useEffect } from 'react'
import { Modal } from 'web-ui'
import { useLocal } from 'web-utils'
import { getDeviceId } from './utils'
import { CloseIcon } from './top-icons'

interface ISelected {
  id_polling: number
  id_polling_answer: number
}

export const AvianHomeFeedback = () => {
  const local = useLocal({
    polling: [] as any,
    pollingTotal: 0 as number,
    selected: null as ISelected | null,
    modal: false as boolean,
    hasPolling: false as boolean,
  })

  useEffect(() => {
    if (local.modal || local.hasPolling) loadPolling()
  }, [local.modal, local.hasPolling])

  const convertIntoObj = (array: any[]) => {
    const objResult = array.reduce((result, currentVal) => {
      result[currentVal.question] = result[currentVal.question] || []
      result[currentVal.question].push(currentVal)
      return result
    }, {})
    let result: any[] = []

    Object.keys(objResult).forEach((key) => {
      const totalScore = objResult[key]
        .map((total: any) => Object.values(total)[4])
        .reduce((acc: any, cur: any) => acc + cur)
      result.push({
        key,
        value: objResult[key],
        totalScore,
      })
    })
    return result
  }

  const checkExistPoll = async () => {
    const deviceId = await getDeviceId()
    const q = await db.query(`
      SELECT device_identifier FROM dtb_polling_device AS pd 
        JOIN dtb_polling AS pp ON pd.id_polling = pp.id_polling
        WHERE pp.is_show=1 AND pd.device_identifier='${deviceId}'`)

    if (q.length) {
      local.modal = false
      local.hasPolling = true
    } else {
      local.modal = true
      local.hasPolling = false
    }

    local.render()
  }

  const loadPolling = async () => {
    db.query(
      `SELECT pp.id_polling,pp.question, pa.answer,pa.id_polling_answer,pa.score FROM dtb_polling AS pp 
      INNER JOIN dtb_polling_answer AS pa ON pp.id_polling = pa.id_polling
      WHERE is_show = 1 ORDER BY pa.id_polling_answer ASC`
    ).then((res) => {
      const result = convertIntoObj(res)
      local.polling = result
      local.render()
    })
  }

  const handleSelectAnswer = (
    id_polling: number,
    id_polling_answer: number
  ) => {
    local.selected = { id_polling, id_polling_answer }
    local.render()
  }

  const handleUpdate = async () => {
    if (local.selected === null) return
    const deviceId = await getDeviceId()
    await db.query(
      `UPDATE dtb_polling_answer SET score = score+1 WHERE id_polling_answer = ${local.selected.id_polling_answer}`
    )
    await db.query(`
      INSERT INTO dtb_polling_device (id_polling,device_identifier) VALUES (${local.selected.id_polling},'${deviceId}')
    `)

    const q = await db.query(`
    SELECT pp.id_polling,pp.question, pa.answer,pa.id_polling_answer,pa.score FROM dtb_polling AS pp 
        INNER JOIN dtb_polling_answer AS pa ON pp.id_polling = pa.id_polling
        WHERE is_show = 1 ORDER BY pa.id_polling_answer`)
    const result = convertIntoObj(q)
    local.polling = result
    local.selected = null
    local.render()

    handlePopup()
    handlePollResult()
  }

  const handlePopup = () => {
    local.modal = !local.modal
    local.render()
  }

  const handlePollResult = () => {
    local.hasPolling = !local.hasPolling
    local.render()
  }

  return (
    <>
      <Modal
        show={local.modal && !local.hasPolling}
        onClose={() => {
          local.modal = false
          local.render()
        }}
      >
        <div className="p-6 bg-white w-4/5 relative">
                    <button
            onClick={() => {
              local.modal = false
              local.render()
            }}
            className="border-none outline-none cursor-pointer group py-1 px-2 absolute top-0 right-1"
          >
            <>
              <CloseIcon/>
            </>
          </button>
          <div className="flex self-stretch flex-col space-y-2.5 items-center justify-center mb-5 mt-3">
            {local.polling.map((pol: any, idxParent: number) => (
              <div key={idxParent}>
                <div className="text-sm leading-tight text-center text-avian-green1 mb-4">
                  {pol.key}
                </div>
                <div className="flex self-stretch flex-col space-y-2.5 items-center justify-center">
                  {pol.value.map((val: any, idxChild: number) => (
                    <div
                      key={idxChild}
                      className={`${
                        local.selected !== null &&
                        local.selected.id_polling_answer ===
                          val.id_polling_answer
                          ? 'avian-green3'
                          : ''
                      } flex self-stretch items-start justify-start p-2.5 border border-warmGray-300`}
                      onClick={() =>
                        handleSelectAnswer(
                          val.id_polling,
                          val.id_polling_answer
                        )
                      }
                    >
                      <div className="text-xs font-medium leading-none text-gray-800">
                        {val.answer}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div
            className={`${
              local.selected === null
                ? 'bg-gray-200 text-gray-400'
                : 'avian-green3'
            } w-full text-white py-1.5 text-center rounded`}
            onClick={handleUpdate}
          >
            Kirim
          </div>
        </div>
      </Modal>

      <Modal
        show={!local.modal && local.hasPolling}
        onClose={() => {
          local.hasPolling = false
          local.render()
        }}
      >
        <div className="p-6 bg-white w-4/5">
          <div className="flex self-stretch flex-col space-y-2.5 justify-center text-xs">
            {local.polling.map((polling: any, idxParent: number) => (
              <div key={idxParent}>
                <div className="text-center text-avian-green1 pb-2.5">
                  {polling.key}
                </div>
                <div className="flex flex-col space-y-4">
                  {polling.value.map((value: any, idxChild: number) => (
                    <div key={idxChild} className="flex flex-col space-y-1">
                      <div className="flex justify-between text-avian-grey4">
                        <div className="">{value.answer}</div>
                        <div className="">
                          {Math.round((value.score / polling.totalScore) * 100)}
                          %
                        </div>
                      </div>
                      <div className="w-full h-3 border relative">
                        <div
                          css={css`
                            width: ${Math.round(
                              (value.score / polling.totalScore) * 100
                            )}%;
                          `}
                          className="avian-green3 h-full"
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
            <div className="text-avian-green1 text-center py-3">
              Terimakasih atas masukan Anda
            </div>
          </div>
          <div
            className="w-full avian-green3 text-white py-1.5 text-center rounded"
            onClick={handlePollResult}
          >
            Selesai
          </div>
        </div>
      </Modal>

      {!local.modal && !local.hasPolling && (
        <div onClick={checkExistPoll}>
          <div
            className={`flex self-stretch flex-col items-end justify-center fixed right-0 inset-y-1/2 z-10`}
          >
            <div
              className={`flex items-center justify-center bg-red-600 rounded-tl-lg rounded-bl-lg`}
              css={css`
                width: 25px;
                min-width: 25px;
                max-width: 25px;
                height: 100px;
                min-height: 100px;
                max-height: 100px;
              `}
            >
              <div
                className={`transform -rotate-90 text-xs leading-none text-center text-white`}
              >
                Feedback
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
