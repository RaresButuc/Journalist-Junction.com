export default function LanguageLocationOptionLabel({ cca2,value }) {
  return (
    <div>
      <img
        className="mx-2 mb-1"
        src={`https://flagsapi.com/${cca2}/flat/32.png`}
      />
      {value}
    </div>
  );
}
