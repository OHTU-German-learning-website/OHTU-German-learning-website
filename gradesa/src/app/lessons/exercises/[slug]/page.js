import { useRouter } from "next/router";

const Post = () => {
  const router = useRouter();

  const { slug } = router.query;
  return <p>Post: {slug}</p>;
};

export default Post;

// This is for dynamic routing but it is WIP
