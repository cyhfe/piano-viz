import { useCallback, useEffect, useRef, useState } from "react";
import { css } from "@emotion/react";
import { Midi } from "@tonejs/midi";
import * as Tone from "tone";
import NotesViz from "./NotesViz";
import { NoteJSON } from "@tonejs/midi/dist/Note";
import * as d3 from "d3";
import { useScale } from "./useScale";

function App() {
  const [midiData, setMidiData] = useState<Midi | null>(null);
  const [notes, setNotes] = useState<NoteJSON[]>([]);
  const synthRef = useRef<Tone.PolySynth<Tone.Synth<Tone.SynthOptions>> | null>(
    null
  );
  const notesRef = useRef<SVGRectElement | null>(null);

  const { xScale, yScale } = useScale();

  function handleClick() {
    play();
  }

  async function play() {
    if (!midiData || Tone.Transport.state === "started") return;
    await Tone.start();
    Tone.Transport.start();
  }

  const schedule = useCallback(
    function schedule() {
      if (!midiData) return () => void 0;
      yScale.domain([0, midiData.duration]);
      const id = Tone.Transport.schedule((time) => {
        midiData.tracks.forEach((track) => {
          const notes = track.notes;
          notes.forEach((note) => {
            Tone.Draw.schedule(() => {
              if (Tone.Transport.state !== "started") return;
              console.log(Tone.Transport.now(), note.time + time);
              console.log(note.name);

              synthRef.current?.triggerAttackRelease(
                note.name,
                note.duration,
                note.time + time + 4,
                note.velocity
              );

              if (!notesRef.current) return;
              const rect = d3.select(notesRef.current).append("rect");

              rect
                .attr("x", xScale(note.name))
                .attr("y", "0")
                .attr("width", xScale.bandwidth())
                .attr("height", yScale(note.duration) * 20)
                .attr("fill", "red")
                .transition()
                .ease(d3.easeLinear)
                .duration(4000 + time)
                .attr("y", "300")
                .end()
                .then(() => {
                  rect.remove();
                });
            }, note.time + time);
          });
        });
      }, 0.5);

      return function cancel() {
        Tone.Transport.clear(id);
      };
    },
    [midiData]
  );

  useEffect(() => {
    if (synthRef.current) return;
    synthRef.current = new Tone.PolySynth(Tone.Synth, {
      envelope: {
        attack: 0.02,
        decay: 0.1,
        sustain: 0.3,
        // release: 1,
      },
    }).toDestination();
  }, []);

  useEffect(() => {
    async function getData() {
      const data = await Midi.fromUrl("/assets/sd1.mid");
      setMidiData(data);
    }
    getData();
  }, []);

  useEffect(() => {
    const cancel = schedule();
    return () => cancel();
  }, [schedule]);

  return (
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
            if (Tone.Transport.state === "started") {
              Tone.Transport.pause();
            }
          }}
        >
          pause
        </button>
      </div>

      <NotesViz
        ref={notesRef}
        notes={notes}
        setNotes={setNotes}
        data={midiData}
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
  );
}

export { App };
