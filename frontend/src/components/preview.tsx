interface IPreviewProps {
  title: string;
  url?: string;
}

function Preview({ title, url }: IPreviewProps) {
  const sanitize_url = (url: string | undefined) => {
    if (url === undefined || url === "") {
      return "/placeholder.png";
    }

    return url;
  };

  return (
    <div>
      <h1>{title}</h1>
      <img className="rounded-md" src={sanitize_url(url)} />
    </div>
  );
}

export default Preview;
