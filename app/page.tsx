import { redirect } from "next/navigation";

type Props = {};

const Home = (props: Props) => {
  redirect("/transport");
};

export default Home;
