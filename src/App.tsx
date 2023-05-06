import MidiPlayer from "midi-player-js";
import { useEffect, useRef } from "react";
import Soundfont from "soundfont-player";
function App() {
  const playerRef = useRef<MidiPlayer.Player | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const instrumentRef = useRef<Soundfont.Player | null>(null);
  useEffect(() => {
    async function init() {
      const player = new MidiPlayer.Player();
      const audioContext = new AudioContext();
      const instrument = await Soundfont.instrument(
        audioContext,
        "acoustic_grand_piano"
      );

      playerRef.current = player;
      audioContextRef.current = audioContext;
      instrumentRef.current = instrument;
    }
    init();
  }, []);
  useEffect(() => {
    async function getData() {
      if (!playerRef.current) return;
      const fetchRes = await fetch("assets/dave.mid");
      const arrayBuffer = await fetchRes.arrayBuffer();
      playerRef.current.loadArrayBuffer(arrayBuffer);
    }
    getData();
  }, []);

  return (
    <div>
      app
      <button
        onClick={async () => {
          if (!audioContextRef.current || !instrumentRef.current) return;
          instrumentRef.current.play("C4");
        }}
      >
        click
      </button>
    </div>
  );
}

export default App;
