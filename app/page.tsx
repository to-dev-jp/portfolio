import { client } from "@/api/clientManagement";
import MainView from "@/components/AppProvider";
import { Work } from "@/types/Types";

async function getWorksList(start: number, limit: number) {
  const listData = await client.getList<Work>({
    endpoint: "works",
    queries: { offset: start, limit: limit },
  });
  const resultData = listData.contents;
  return resultData;
}

export default async function Home() {
  const works = await getWorksList(0, 3);
  return <MainView works={works} />;
}
