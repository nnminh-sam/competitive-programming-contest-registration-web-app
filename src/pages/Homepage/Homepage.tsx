import { LogoutOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Menu } from "antd";
import Sider from "antd/es/layout/Sider";
import { isArray } from "lodash";
import { FC, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilValue } from "recoil";
import Card from "../../components/Card/Card";
import Text from "../../components/Text";
import Colors from "../../constants/color";
import { Contest, ContestApi } from "../../services/contest";
import ContestantAtom from "../../services/contestant/contestant.atom";

const Homepage: FC = () => {
  const [contestList, setContestList] = useState<Contest[]>([]);
  const participatedContests = useRecoilValue(
    ContestantAtom.participatedContests
  );

  const nav = useNavigate();

  useEffect(() => {
    const fetchContestList = async () => {
      const contestList = await ContestApi.getList({
        page: 1,
        limit: 10,
      });
      if (isArray(contestList)) {
        setContestList(contestList);
      }
    };
    fetchContestList();
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      nav("/sign-in");
    }
  }, [nav]);

  const handleSignOut = () => {
    localStorage.removeItem("token"); // Remove token from localStorage
    nav("/sign-in"); // Navigate to Sign In page
  };

  // Filtering the contests
  const participatedContestIds = new Set(participatedContests.map((c) => c.id));

  const participated = contestList.filter((contest) =>
    participatedContestIds.has(contest.id)
  );

  const upcoming = contestList.filter(
    (contest) => !participatedContestIds.has(contest.id)
  );

  return (
    <div className="bg-[#F5F5F5] flex flex-col px-6 py-8 gap-6">
      <div className="w-full flex justify-between items-center">
        <div className="relative w-[250px]">
          <img
            src="logo.svg"
            alt="login-bg"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
      <div className="flex gap-6 justify-center">
        <div className="flex flex-col h-screen">
          <Sider
            trigger={null}
            collapsible
            className="rounded-xl bg-transparent "
          >
            <div className="demo-logo-vertical  bg-transparent rounded-xl" />
            <Menu
              theme="light"
              mode="inline"
              className="rounded-xl"
              items={[
                {
                  key: "1",
                  icon: <UserOutlined style={{ color: Colors.PRIMARY_BLUE }} />,
                  label: (
                    <Text
                      color={Colors.PRIMARY_BLUE}
                      type="body-2"
                      onClick={() => nav("/account")}
                    >
                      Account
                    </Text>
                  ),
                },
              ]}
            />
          </Sider>
          <Button
            type="text"
            icon={<LogoutOutlined />}
            className="w-1/2 flex items-center jus p-2 text-red-500"
            onClick={handleSignOut}
          >
            Sign Out
          </Button>
        </div>

        <div className="bg-white flex-1 rounded-xl px-4 py-6">
          {/* Participated Contests Section */}
          {participated.length > 0 && (
            <>
              <Text
                type="headline-4"
                color={Colors.PRIMARY_BLUE}
                className="mb-4"
              >
                Participated Contests
              </Text>

              <div className="flex flex-wrap gap-4 justify-start mb-6">
                {participated.map((contest) => (
                  <Card
                    className="w-[30%]"
                    key={contest.id}
                    {...contest}
                    is_registered={true}
                  />
                ))}
              </div>
            </>
          )}

          {/* Upcoming Contests Section */}
          {upcoming.length > 0 && (
            <>
              <Text
                type="headline-4"
                color={Colors.PRIMARY_BLUE}
                className="mb-2"
              >
                Upcoming Contests
              </Text>
              <div className="flex flex-wrap gap-4 justify-start">
                {upcoming.map((contest) => (
                  <Card
                    className="w-[30%]"
                    key={contest.id}
                    {...contest}
                    is_registered={false}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Homepage;
