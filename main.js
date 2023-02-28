import './style.css'
import UserJson from './user.json'

const { users } = UserJson
const selected = new Set()

document.querySelector('#app').innerHTML = `
  <div>
    <button id="mic-on"></button>
    <div class="row">
      <div class="col">
        <span>전체 유저 (total: ${users.length})</span>
        <div class="box">
          <ul>
            ${users.reduce((acc, cur) => acc + `<li>${cur.id} | ${cur.account} | ${cur.name}</li>`, '')}
          </ul>
        </div>
      </div>
      <div class="col">
        <span>선택된 유저 : (count: <span id="select-cnt">${selected.size}</span>)</span>
        <div id="select-user" class="box"></div>
      </div>
    </div>
  </div>
`

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
const recognition = new SpeechRecognition()

let micFlag = false
const initMicOnBtn = (element) => {
  element.innerText = '마이크 켜기'

  element.addEventListener('click', () => {
    if (micFlag) {
      recognition.stop()

      element.innerText = '마이크 켜기'
      micFlag = false
      return
    }

    element.innerText = '마이크 끄기'

    recognition.lang = 'ko-KR'
    recognition.continuous = false
    recognition.interimResults = false
    recognition.maxAlternatives = 1

    micFlag = true
    recognition.start()
  })
}

initMicOnBtn(document.getElementById('mic-on'))

recognition.onspeechend = () => {
  recognition.stop()

  micFlag = false
}

recognition.onresult = (event) => {
  console.log(event)
  console.log(event.results[0][0].transcript)

  users.filter((usr) => {
    if ((event.results[0][0].transcript || '').indexOf(usr.name) !== -1) {
      selected.add(usr)
    }
  })

  document.getElementById('select-user').innerHTML = `<ul>${Array.from(selected).reduce((acc, cur) => acc + `<li>${cur.id} | ${cur.account} | ${cur.name}</li>`, '')}</ul>`
  document.getElementById('select-user').innerText = selected.size
}
recognition.onnomatch = (event) => {
  console.log(event)

  console.error('인식 결과 없음')
}

recognition.onerror = (event) => {
  console.error(`에러 발생!!\n이유: ${event.error}`)
  alert(`에러 발생!!\n이유: ${event.error}`)

  micFlag = false
}
