<template>
  <div class="voice">
    <van-button @click="startSpeechToTxt">Speech to txt</van-button>
    <p>{{ transcription_ }}</p>
  </div>
</template>

<script>
export default {
  name: "speech_to_text",
  data() {
    return {
      runtimeTranscription_: "",
      transcription_: [],
      lang_: "cmn-Hans-CN"
    };
  },
  methods: {
    startSpeechToTxt() {
      // initialisation of voicereco

      window.SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new window.SpeechRecognition();
      recognition.lang = this.lang_;
      recognition.interimResults = true;
      recognition.continuous = true;

      // event current voice reco word
      recognition.onresult = event => {
        var text = Array.from(event.results)
          .map(result => result[0])
          .map(result => result.transcript)
          .join("");
        this.runtimeTranscription_ = text;
        alert(text);
      };
      // end of transcription
      // recognition.addEventListener("end", () => {
      //   this.transcription_.push(this.runtimeTranscription_);
      //   this.runtimeTranscription_ = "";
      //   recognition.stop();
      // });
      recognition.start();

      // speechRecognition.onresult = event => {
      //   let interim_transcript = '';

      //   for (let i = event.resultIndex; i < event.results.length; ++i) {
      //     if (event.results[i].isFinal) {
      //       final_transcript += event.results[i][0].transcript;
      //     } else {
      //       interim_transcript += event.results[i][0].transcript;
      //     }
      //   }
      //   document.querySelector('#final').innerHTML = final_transcript;
      //   document.querySelector('#interim').innerHTML = interim_transcript;
      //   alert(interm_transcript)
      //   alert(final_transcript)
      // };

      // document.querySelector('#start').onclick = () => {
      //   speechRecognition.start();
      // };
    }
  }
};
</script>
