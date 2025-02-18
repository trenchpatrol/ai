import {Button} from "~/components/ui";
import {useSendAnalyzer} from "~/hooks/useAnalyzer";

const Test = () => {
  const analyzer = useSendAnalyzer();

  const handleStartAnalyzer = () => {
    analyzer.mutate({address: "ED5nyyWEzpPPiWimP8vYm7sD7TD3LAt3Q3gRTWHzPJBY"});
  };

  return (
    <div>
      <Button onClick={handleStartAnalyzer}>Start Analyzer</Button>
    </div>
  );
};

export default Test;
