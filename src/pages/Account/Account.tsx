import { UserOutlined } from "@ant-design/icons";
import { Menu, message } from "antd";
import Sider from "antd/es/layout/Sider";
import { FC, useMemo } from "react";
import Colors from "../../constants/color";
import Text from "../../components/Text";
import { useFormik } from "formik";
import { Contestant, ContestantApi } from "../../services/contestant";
import { useRecoilValue } from "recoil";
import ContestantAtom from "../../services/contestant/contestant.atom";
import Input from "../../components/Input";
import Select from "../../components/Select";
import { Affiliation } from "../../services/affiliation";
import AffiliationAtom from "../../services/affiliation/affiliation.atom";
import Button from "../../components/Button";
import { isArray } from "lodash";

const Account: FC = () => {
  const contestant = useRecoilValue(ContestantAtom.curentContestant);
  console.log("🚀 ~ contestant:", contestant);
  const schoolyearList = useRecoilValue(AffiliationAtom.affiliationList);
  const schoolYearOptions = useMemo(() => {
    if (isArray(schoolyearList)) {
      return schoolyearList.map((item: Affiliation) => ({
        label: item.name,
        value: item.id,
      }));
    } 
  }, [schoolyearList]);

  const form = useFormik<Contestant>({
    enableReinitialize: true,
    initialValues: contestant as Contestant, // Force TypeScript to treat it as Contestant
    validateOnChange: true,
    validate: (values) => {
      const errors: Record<string, string> = {};

      if (!values.email) {
        errors.email = "Required field";
      }

      if (!values.first_name) {
        errors.first_name = "Required field";
      }

      if (!values.last_name) {
        errors.last_name = "Required field";
      }

      if (!values.student_id) {
        errors.student_id = "Required field";
      }

      return errors;
    },
    onSubmit: async (values) => {
      ContestantApi.updateContestant(values).then((res) => {
        if (res) {
          form.setSubmitting(false);
          message.success("Update success");
        }
      });
    },
  });

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
          // collapsed={collapsed}
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
                  <Text color={Colors.PRIMARY_BLUE} type="body-2">
                    Account
                  </Text>
                ),
              },
            ]}
          />
        </Sider>
        <div className="flex flex-col bg-white rounded-xl px-4 py-6">
          <Text type="headline-4" color={Colors.PRIMARY_BLUE} className="mb-4">
            Account
          </Text>
          <div className="flex flex-wrap gap-4">
            <Input
              type="email"
              className="w-[48%]"
              bordered
              label="Email address*"
              placeholder="Enter email address"
              value={form.values?.email}
              onChange={form.handleChange("email")}
              error={form.errors.email}
            />
            <Input
              type="text"
              className="w-[48%]"
              bordered
              label="First name*"
              placeholder="Enter first name"
              value={form.values?.first_name}
              onChange={form.handleChange("first_name")}
              error={form.errors.first_name}
            />
            <Input
              type="text"
              className="w-[48%]"
              bordered
              label="Last name*"
              placeholder="Enter last name"
              value={form.values?.last_name}
              onChange={form.handleChange("last_name")}
              error={form.errors.last_name}
            />
            <Input
              type="text"
              className="w-[48%]"
              bordered
              label="Username"
              placeholder="Enter username"
              value={form.values?.username}
              onChange={form.handleChange("username")}
              error={form.errors.username}
            />
            <Input
              type="text"
              className="w-[48%]"
              bordered
              label="Student ID*"
              placeholder="Enter student ID"
              value={form.values?.student_id}
              onChange={form.handleChange("student_id")}
              error={form.errors.student_id}
            />
            <div className="flex items-center gap-4 w-full">
              <Select
                className="w-[300px]"
                bordered
                label="Gender*"
                defaultValue={"Male"}
                value={form.values?.gender}
                onChange={(value) => form.setFieldValue("gender", value)}
                error={form.errors.gender}
                options={[
                  { label: "Male", value: "Male" },
                  { label: "Female", value: "Female" },
                  { label: "Other", value: "Other" },
                ]}
              />
              <Select
                className="w-[300px]"
                bordered
                label="School Year"
                value={form.values?.school_year}
                onChange={(value) => form.setFieldValue("school_year", value)}
                error={form.errors.school_year}
                options={schoolYearOptions}
              />
            </div>
            <div className="w-full flex justify-center mt-4">
              <Button
                disabled={!form.dirty}
                loading={form.isSubmitting}
                onClick={() => form.handleSubmit()}
                className="justify-center w-[200px] !h-[45px] text-xl items-center"
              >
                Save
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Account;
