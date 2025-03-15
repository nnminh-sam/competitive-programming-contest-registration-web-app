import { Layout, Menu, Button } from "antd";
import { Header, Content } from "antd/es/layout/layout";
import Sider from "antd/es/layout/Sider";
import { FC, useEffect, useState } from "react";
import { isArray } from "lodash";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UploadOutlined,
  UserOutlined,
  VideoCameraOutlined,
} from "@ant-design/icons";
import Text from "../../components/Text";
import Card from "../../components/Card/Card";
import { Contest, ContestApi } from "../../services/contest";
import Colors from "../../constants/color";
import { useNavigate } from "react-router-dom";

const Homepage: FC = () => {
  const [collapsed, setCollapsed] = useState<boolean>(false);
  const [contestList, setContestList] = useState<Contest[]>([]);
  console.log("🚀 ~ contestList:", contestList);
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
      <div className="flex gap-6 justify-start">
        <Sider
          trigger={null}
          collapsible
          collapsed={collapsed}
          className="rounded-xl bg-transparent "
        >
          <div className="demo-logo-vertical  bg-transparent rounded-xl" />
          <Menu
            theme="light"
            mode="inline"
            className="rounded-xl"
            // defaultSelectedKeys={["1"]}
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
        <div className="bg-white flex-1 rounded-xl px-4 py-6">
          <Text type="headline-4" color={Colors.PRIMARY_BLUE} className="mb-4">
            Contests
          </Text>
          <div className="flex flex-wrap gap-4 justify-start">
            {contestList.map((contest) => (
              <Card className="w-[30%]" key={contest.id} {...contest} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Homepage;
