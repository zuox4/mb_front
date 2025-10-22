interface Leader {
  display_name: string;
  email: string;
}

interface BossProps {
  leader: Leader | null;
}

const Boss = ({ leader }: BossProps) => {
  return (
    <div>
      {
        <div className="bg-white p-4 rounded-lg w-fit">
          {leader ? (
            <>
              <h1 className="font-codec">{leader?.display_name}</h1>
              <h1>{leader?.email}</h1>
            </>
          ) : (
            "Не назначен"
          )}
        </div>
      }
    </div>
  );
};

export default Boss;
