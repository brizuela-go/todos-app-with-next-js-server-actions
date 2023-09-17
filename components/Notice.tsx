type NoticeProps = {
  message: string;
};

export const Notice = ({ message }: NoticeProps) => {
  return (
    <div className="my-10 text-center text-2xl">
      <h3 className={""}>WebPush PWA</h3>
      <p className={""}>{message}</p>
    </div>
  );
};
