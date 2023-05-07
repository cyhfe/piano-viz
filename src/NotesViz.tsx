import { css } from "@emotion/react";
import { Midi } from "@tonejs/midi";
import { useEffect, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import * as d3 from "d3";
import * as Tone from "tone";
import { useSynth } from "./App";
interface NotesVizProps {
  data: Midi | null;
  isPlaying: boolean;
}

function NotesViz({ data, isPlaying }: NotesVizProps) {
  const [time, setTime] = useState<number | null>(null);

  useEffect(() => {
    let id: number | undefined;
    function run() {
      id = requestAnimationFrame(() => {
        // console.log(Tone.Transport.now());
        setTime(Tone.Transport.now());
        run();
      });
    }
    isPlaying && run();
    return () => {
      id && cancelAnimationFrame(id);
    };
  }, [isPlaying]);

  return (
    <>
      <div>{time}</div>
      <svg
        css={css`
          display: block;
        `}
        viewBox="0 ,0, 400, 300"
        width={"100%"}
        height={"80%"}
        preserveAspectRatio="none"
      >
        <rect x={0} y={0} width={400} height={300} fill="black"></rect>
        {data &&
          data.tracks.map((track) => {
            if (!track.notes.length) return null;
            return (
              <g className="track" key={uuidv4()}>
                {track.notes.map((note) => {
                  if (time && note.time - 4 < time) {
                    return <Note note={note} isPlaying={isPlaying} />;
                  } else return null;
                })}
              </g>
            );
          })}
      </svg>
    </>
  );
}

interface NoteJSON {
  time: number;
  midi: number;
  name: string;
  velocity: number;
  duration: number;
  ticks: number;
  durationTicks: number;
}

interface NoteProps {
  note: NoteJSON;
  isPlaying: boolean;
}

function Note({ note, isPlaying }: NoteProps) {
  const ref = useRef<SVGElement | null>(null);
  const [end, setEnd] = useState(false);
  const ctx = useSynth();
  const { synth } = ctx;

  // useEffect(() => {
  //   if (!ref.current) return;
  //   ref.current.addEventListener("endEvent", () => {
  //     if (!synth) return;
  //     console.log("end");
  //     setEnd(true);
  //     console.log(ctx);

  //     // synth.triggerAttackRelease(note.name, note.duration, 0, note.velocity);
  //     // Tone.Transport.scheduleOnce((time) => {
  //     console.log(note);

  //     // synth.triggerAttackRelease(
  //     //   note.name,
  //     //   note.duration,
  //     //   Tone.now(),
  //     //   note.velocity
  //     // );
  //     // }, note.time);
  //   });
  // }, [ctx, note, synth]);

  // useEffect(() => {

  // }, [isPlaying])
  // useEffect(() => {
  //   if (!ref.current) return;
  //   console.log(note);

  //   d3.select(ref.current)
  //     .attr("x", 195)
  //     .attr("y", 20)
  //     .attr("width", "10")
  //     .attr("height", "10")
  //     .attr("fill", "blue")
  //     .transition()
  //     .duration(note.duration + 10000)
  //     .delay(note.time)
  //     .attr("x", 195)
  //     .attr("y", 300)
  //     .remove();
  // }, [note]);

  // 16.458333333333332 0.08854166666666785

  return note && !end && isPlaying ? (
    <rect className="note" x={195} width={10} height={10} fill="red">
      <animate
        ref={ref}
        attributeType="XML"
        attributeName="y"
        from="-20"
        to="300"
        dur={4 + "s"}
        begin={0}
      />
    </rect>
  ) : null;
}

export default NotesViz;
