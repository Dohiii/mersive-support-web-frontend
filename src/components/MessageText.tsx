export default function MessageText({
  text,
  success,
  hide
}: {
  text: string;
  success: boolean;
  hide: boolean;
}) {
  return <div className="message-contatiner">
    <p className={`error-text success-${success} hide-${hide}`}>{text}</p>
    </div>
}
