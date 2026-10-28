import { use } from "react";

interface UserIdPageProps {
  params: Promise<{
    userId: string;
  }>;
}

const Page = ({ params }: UserIdPageProps) => {
  const { userId } = use(params);

  return (
    <div>
      User ID: {userId}
    </div>
  );
};

export default Page;