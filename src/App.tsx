import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { css, Global } from "@emotion/react";
import { Midi } from "@tonejs/midi";
import * as Tone from "tone";
import NotesViz from "./NotesViz";
import { NoteJSON } from "@tonejs/midi/dist/Note";
import * as d3 from "d3";

const SynthContext = createContext<SynthContextValue | null>(null);
interface SynthContextValue {
  synth: Tone.PolySynth<Tone.Synth<Tone.SynthOptions>> | null;
}
interface SynthProviderProps {
  children: React.ReactNode;
  synth: Tone.PolySynth<Tone.Synth<Tone.SynthOptions>> | null;
}
function SynthProvider({ children, synth }: SynthProviderProps) {
  const ctx = useMemo(() => {
    return { synth };
  }, [synth]);
  return <SynthContext.Provider value={ctx}>{children}</SynthContext.Provider>;
}

function useSynth(): SynthContextValue {
  const ctx = useContext(SynthContext);
  if (!ctx) throw Error;
  return ctx;
}

function App() {
  // const midiRef = useRef<Midi | null>(null);
  const [midiData, setMidiData] = useState<Midi | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [notes, setNotes] = useState<NoteJSON[]>([]);
  const synthRef = useRef<Tone.PolySynth<Tone.Synth<Tone.SynthOptions>> | null>(
    null
  );

  const notesRef = useRef<SVGRectElement | null>(null);
  // const time = useRef(null)
  function handleClick() {
    play();
  }

  async function play() {
    if (!midiData) return;
    await Tone.start();
    Tone.Transport.start();
    // setIsPlaying(true);
  }

  useEffect(() => {
    if (synthRef.current) return;
    synthRef.current = new Tone.PolySynth(Tone.Synth, {
      envelope: {
        attack: 0.02,
        decay: 0.1,
        sustain: 0.3,
        release: 1,
      },
    }).toDestination();
  }, []);

  useEffect(() => {
    async function init() {
      if (!midiData) return;

      Tone.Transport.on("start", () => {
        // setIsPlaying(true);
        console.log("start");
      });

      Tone.Transport.schedule((time) => {
        midiData.tracks.forEach((track) => {
          const notes = track.notes;
          notes.forEach((note) => {
            synthRef.current?.triggerAttackRelease(
              note.name,
              note.duration,
              note.time + time + 4,
              note.velocity
            );

            Tone.Draw.schedule(() => {
              // do drawing or DOM manipulation here
              // setNotes((notes) => [...notes, note]);
              if (!notesRef.current) return;
              // const notesGroup = d3.select(notesRef.current).append("g");
              const rect = d3.select(notesRef.current).append("rect");

              rect
                .attr("x", "150")
                .attr("y", "0")
                .attr("width", "10")
                .attr("height", "10")
                .attr("fill", "red")
                .transition()
                .ease(d3.easeLinear)
                .duration(4000 + time)
                .attr("y", "300")
                .end()
                .then(() => {
                  rect.remove();
                });

              console.log(time, Tone.now(), note.time);
            }, note.time + time);
          });
        });
      }, 0.5);
    }
    init();
  }, [midiData]);

  useEffect(() => {
    async function getData() {
      const data = await Midi.fromUrl("/assets/bach_inventions_773.mid");
      setMidiData(data);
    }
    getData();
  }, []);

  return (
    <SynthProvider synth={synthRef.current}>
      <div
        css={css`
          height: 100vh;
        `}
      >
        <div
          css={css`
            height: 10%;
          `}
        >
          <button onClick={() => handleClick()}>++</button>
          <button
            onClick={() => {
              // console.log(Tone.Transport.now());
            }}
          ></button>
        </div>

        <NotesViz
          ref={notesRef}
          notes={notes}
          setNotes={setNotes}
          data={midiData}
          isPlaying={isPlaying}
        />

        <svg
          viewBox="0 0 600 300"
          css={css`
            display: block;
            width: 100%;
            height: 10%;
          `}
        ></svg>
      </div>
    </SynthProvider>
  );
}

export { useSynth, App };
