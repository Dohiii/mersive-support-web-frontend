export default function MessageText({
    text,
    success,
    hide
  }: {
    text: string;
    success: boolean;
    hide: boolean;
  }) {
    return <p className={`error-text success-${success} hide-${hide}`}>{text}</p>;
  }
  