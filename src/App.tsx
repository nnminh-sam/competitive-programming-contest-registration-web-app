import { ConfigProvider } from "antd";
import { FC, useEffect } from "react";
import { RecoilRoot } from "recoil";
import RecoilNexus from "recoil-nexus";
import Routers from "./routers";
import { ContestantApi } from "./services/contestant";
import { AffiliationApi } from "./services/affiliation";

const App: FC = () => {
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      ContestantApi.getMe();
    }
    const fetchSchoolYearList = async () => {
      await AffiliationApi.getList({ page: 1, limit: 100 });
    };
    const fetchParticipatedContest = async () => {
      await ContestantApi.getParticipatedContests();
    };
    fetchParticipatedContest();
    fetchSchoolYearList();
  }, []);

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#3A6EF5",
          fontFamily: "Poppins, sans-serif",
        },
        components: {
          Button: {
            controlHeight: 40,
            borderRadius: 8,
            colorPrimaryBg: "#3A6EF5",
            colorPrimary: "#3A6EF5",
          },
          Input: {
            controlHeight: 40,
            borderRadius: 8,
          },
          Table: {
            borderRadius: 12,
          },
          Select: {
            controlHeight: 40,
            borderRadius: 8,
          },
        },
      }}
      // renderEmpty={() => (
      //   <Empty className="empty my-auto" img="/svgs/empty.svg" />
      // )}
    >
      <RecoilRoot>
        <RecoilNexus />
        <Routers />
        {/* <DeleteModal /> */}
        {/* <ConfirmationModal /> */}
        {/* <TaskDeliverableModal /> */}
      </RecoilRoot>
    </ConfigProvider>
  );
};

export default App;
