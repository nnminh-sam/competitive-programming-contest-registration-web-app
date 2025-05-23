import { LogoutOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Menu } from "antd";
import Sider from "antd/es/layout/Sider";
import { isArray } from "lodash";
import { FC, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Card from "../../components/Card/Card";
import Text from "../../components/Text";
import Colors from "../../constants/color";
import { Contest, ContestApi } from "../../services/contest";

const Homepage: FC = () => {
  const [contestList, setContestList] = useState<Contest[]>([]);
  const [participatedContests, setParticipatedContests] = useState<Contest[]>(
    []
  );
  const [allContests, setAllContests] = useState<Contest[]>([]);

  const nav = useNavigate();

  const filterOutParticipatedContests = (
    contests: Contest[],
    participated: Contest[]
  ) => {
    return contests.filter(
      (contest) => !participated.some((p) => p.id === contest.id)
    );
  };

  const fetchParticipatedContests = async () => {
    const response = await ContestApi.getParticipatedContests();
    if (response?.data && isArray(response.data)) {
      const newParticipatedContests: Contest[] = response.data;
      setParticipatedContests(newParticipatedContests);

      // Directly update contestList by filtering out the newly participated contest
      setContestList((prevContestList) =>
        prevContestList.filter(
          (contest) => !newParticipatedContests.some((p) => p.id === contest.id)
        )
      );
    }
  };

  useEffect(() => {
    const fetchContestList = async () => {
      const contestList = await ContestApi.getList({
        page: 1,
        limit: 10,
      });
      if (isArray(contestList)) {
        setAllContests(contestList);
        // Initial filter against current participated contests
        setContestList(
          filterOutParticipatedContests(contestList, participatedContests)
        );
      }
    };
    Promise.all([fetchContestList(), fetchParticipatedContests()]);
  }, []);

  // Update contest list whenever allContests or participatedContests change
  useEffect(() => {
    setContestList(
      filterOutParticipatedContests(allContests, participatedContests)
    );
  }, [allContests, participatedContests]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      nav("/sign-in");
    }
  }, [nav]);

  const handleSignOut = () => {
    localStorage.removeItem("token");
    nav("/sign-in");
  };

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
          {participatedContests.length > 0 && (
            <>
              <Text
                type="headline-4"
                color={Colors.PRIMARY_BLUE}
                className="mb-4"
              >
                Participated Contests
              </Text>

              <div className="flex flex-wrap gap-4 justify-start mb-6">
                {participatedContests.map((contest) => (
                  <Card
                    className="w-[30%]"
                    key={contest.id}
                    {...contest}
                    is_registered={true}
                    onRegister={fetchParticipatedContests}
                  />
                ))}
              </div>
            </>
          )}

          {/* Upcoming Contests Section */}
          {contestList.length > 0 && (
            <>
              <Text
                type="headline-4"
                color={Colors.PRIMARY_BLUE}
                className="mb-2"
              >
                Upcoming Contests
              </Text>
              <div className="flex flex-wrap gap-4 justify-start">
                {contestList.map((contest) => (
                  <Card
                    className="w-[30%]"
                    key={contest.id}
                    {...contest}
                    is_registered={false}
                    onRegister={fetchParticipatedContests}
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
