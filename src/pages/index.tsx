import {GetServerSideProps} from "next";

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    redirect: {
      destination: "/chat",
      permanent: false,
    },
  };
};

const Home = () => null;
export default Home;
