import Boards from "./BoardsPage/page";

export default function Home() {
  console.log(process.env.NEXT_PUBLIC_SUPABASE_URL);
  return (
    <Boards/>
  );
}
