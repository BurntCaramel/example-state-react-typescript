import * as React from "react";
import "./styles.css";
// import { useService } from "@xstate/react/lib/fsm";
import { useSubscription } from "use-subscription";
import { StateMachine, EventObject, Typestate } from "@xstate/fsm";
import { trelloBoardService } from "./instances";

function useService<
  Context extends object,
  Event extends EventObject = EventObject,
  State extends Typestate<Context> = any
>(service: StateMachine.Service<Context, Event, State>) {
  const config = React.useMemo(() => {
    let currentState: StateMachine.State<Context, Event, State> | undefined;
    return {
      getCurrentValue() {
        return currentState;
      },
      subscribe(callback: () => void) {
        const { unsubscribe } = service.subscribe(state => {
          currentState = state;
          callback();
        });
        return unsubscribe;
      }
    };
  }, [service]);

  return useSubscription(config);
}

function TrelloBoard(): JSX.Element {
  const a = useService(trelloBoardService);

  // React.useEffect(() => {
  //   trelloBoardService.send("START");
  // }, []);

  if (!a) {
    return <p>Initial</p>;
  } else {
    return (
      <div>
        <p>{a.value}</p>
        <p>{a.context.data?.id}</p>
      </div>
    );
  }
  // } else if (a.value === "idle") {
  //   return <p>Idle</p>;
  // } else if (a.matches("loaded")) {
  //   return <p>Loaded</p>;
  // } else {
  //   return <p>Unknown</p>;
  // }
}

function generateCSSRule(name: string): string {
  const toName = (valueString: string) =>
    valueString.replace(/[%:]/g, found => "\\" + found);

  if (name.startsWith("w-")) {
    return `.${toName(name)} { width: ${name.substring(2)}; }`;
  }

  return `.${toName(name)} { display: ${name}; }`;
}

const styles = ["block", "flex", "w-100%"].map(generateCSSRule);

export default function App() {
  return (
    <div className="App">
      <style>{styles}</style>
      <button
        className="block w-100%"
        onClick={() => {
          trelloBoardService.send("START");
        }}
      >
        Start
      </button>
      <TrelloBoard />
    </div>
  );
}
