export default function RenderHTML({ data }) {
  return <div dangerouslySetInnerHTML={{ __html: data }} />;
}
