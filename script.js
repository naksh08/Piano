const audioContext = new AudioContext()
// creating a new instance of the AudioContext interface. This interface is a part of Web Audio API.

const NOTE_DETAILS = [
  { note: "C", key: "Z", frequency: 261.626, active: false },
  { note: "Db", key: "S", frequency: 277.183, active: false },
  { note: "D", key: "X", frequency: 293.665, active: false },
  { note: "Eb", key: "D", frequency: 311.127, active: false },
  { note: "E", key: "C", frequency: 329.628, active: false },
  { note: "F", key: "V", frequency: 349.228, active: false },
  { note: "Gb", key: "G", frequency: 369.994, active: false },
  { note: "G", key: "B", frequency: 391.995, active: false },
  { note: "Ab", key: "H", frequency: 415.305, active: false },
  { note: "A", key: "N", frequency: 440, active: false },
  { note: "Bb", key: "J", frequency: 466.164, active: false },
  { note: "B", key: "M", frequency: 493.883, active: false }
]

// event listener for pressing down the key 
document.addEventListener("keydown", e => {
  if (e.repeat) return
//   to fix long key press 
  const keyboardKey = e.code
//   fetching the code of the key pressed
  const noteDetail = getNoteDetail(keyboardKey)
// getting the corresponding object from NOTE_DETAILS array, iff exists
  if (noteDetail == null) return
// if the key pressed does not belong to any of the notes, the noteDetail will have null and the function terminates
  noteDetail.active = true
//   if the key pressed is present, we will set the active: true for that object
  playNotes()
//   finally calling the playNotes function
})

// event listener for releasing the key up
document.addEventListener("keyup", e => {
  const keyboardKey = e.code
//   getting details, which key has been released
  const noteDetail = getNoteDetail(keyboardKey)
// checking if the key that is released is present in NOTE_LIST or not
  if (noteDetail == null) return
// if key not present, function terminates
  noteDetail.active = false
//   setting the active: false for the corresponding key
  playNotes()
})

function getNoteDetail(keyboardKey) {
  return NOTE_DETAILS.find(n => `Key${n.key}` === keyboardKey)
//   traversing the array of objects to find the matching key pressed code
}

function playNotes() {
  NOTE_DETAILS.forEach(n => {
    const keyElement = document.querySelector(`[data-note="${n.note}"]`)
    // selecting the element corresponding to the key pressed to make the .active class toggle
    keyElement.classList.toggle("active", n.active)
    if (n.oscillator != null) {
      n.oscillator.stop()
      n.oscillator.disconnect()
    }
  })

  const activeNotes = NOTE_DETAILS.filter(n => n.active)
  const gain = 1 / activeNotes.length
  activeNotes.forEach(n => {
    startNote(n, gain)
  })
}

function startNote(noteDetail, gain) {
  const gainNode = audioContext.createGain()
  gainNode.gain.value = gain
  const oscillator = audioContext.createOscillator()
  oscillator.frequency.value = noteDetail.frequency
  oscillator.type = "sine"
  oscillator.connect(gainNode).connect(audioContext.destination)
  oscillator.start()
  noteDetail.oscillator = oscillator
}
