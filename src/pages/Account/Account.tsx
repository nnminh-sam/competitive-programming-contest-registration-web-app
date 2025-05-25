import { UserOutlined } from "@ant-design/icons";
import { Menu, message, Modal } from "antd";
import Sider from "antd/es/layout/Sider";
import { FC, useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
import { Team, TeamApi } from "../../services/team";

const Account: FC = () => {
  const nav = useNavigate();
  const contestant = useRecoilValue(ContestantAtom.curentContestant);
  const schoolyearList = useRecoilValue(AffiliationAtom.affiliationList);
  const schoolYearOptions = useMemo(() => {
    if (isArray(schoolyearList)) {
      return schoolyearList.map((item: Affiliation) => ({
        label: item.name,
        value: item.id,
      }));
    }
  }, [schoolyearList]);
  const [serverError, setServerError] = useState<string>("");
  const [teamData, setTeamData] = useState<Team | null>(null);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [showTeamForm, setShowTeamForm] = useState(false);
  const [teamFormData, setTeamFormData] = useState({
    name: "",
    description: "",
    members: ["", "", ""] as [string, string, string],
  });

  const MAX_TEAM_SIZE = 3;
  const currentTeamSize = teamData?.members?.length || 0;
  const canAddMembers = currentTeamSize < MAX_TEAM_SIZE;

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      nav("/sign-in");
    }
  }, [nav]);

  useEffect(() => {
    const fetchContestantData = async () => {
      setInitialLoading(true);
      try {
        await ContestantApi.getMe();
      } catch (error) {
        console.error("Failed to fetch contestant data:", error);
      } finally {
        setInitialLoading(false);
      }
    };

    fetchContestantData();
  }, []);

  useEffect(() => {
    const fetchTeamData = async () => {
      if (contestant?.team) {
        setLoading(true);
        try {
          const team = await TeamApi.getTeamDetail(contestant.team.id);
          setTeamData(team.data);
        } catch (error) {
          console.error("Failed to fetch team data:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    if (!initialLoading) {
      fetchTeamData();
    }
  }, [contestant, initialLoading]);

  const form = useFormik<Contestant>({
    enableReinitialize: true,
    initialValues: contestant as Contestant,
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
      ContestantApi.updateContestant(contestant?.id as string, values).then(
        (res) => {
          if (!res.isError) {
            form.setSubmitting(false);
            message.success("Update success");
          } else {
            setServerError(res.message);
          }
        }
      );
    },
  });

  const handleShowTeamForm = () => {
    setTeamFormData({
      name: "",
      description: "",
      members: [contestant?.email || "", "", ""] as [string, string, string],
    });
    setShowTeamForm(true);
  };

  const handleCreateTeam = async () => {
    try {
      const result = await TeamApi.createTeam({
        name: teamFormData.name,
        description: teamFormData.description,
        members: teamFormData.members as [string, string, string],
      });

      if (!result.isError) {
        setShowTeamForm(false);
        // Refresh contestant data to get the new team
        await ContestantApi.getMe();
      } else {
        message.error(result.message || "Failed to create team");
      }
    } catch (error) {
      message.error("Failed to create team");
    }
  };

  const handleUpdateTeam = async () => {
    if (!teamData?.id) return;

    try {
      const newMemberEmail = teamFormData.members[0];
      if (!newMemberEmail) {
        message.error("Please enter a member email");
        return;
      }

      const result = await TeamApi.updateTeam(teamData.id, {
        members: [newMemberEmail],
      });

      if (result) {
        message.success("Team updated successfully");
        setShowTeamForm(false);
        // Refresh team data
        const team = await TeamApi.getTeamDetail(teamData.id);
        setTeamData(team.data);
      }
    } catch (error) {
      message.error("Failed to update team");
    }
  };

  const handleDeleteTeam = async () => {
    if (!teamData?.id) return;

    Modal.confirm({
      title: "Delete Team",
      content:
        "Are you sure you want to delete this team? This action cannot be undone.",
      okText: "Yes, Delete",
      okType: "danger",
      cancelText: "No, Cancel",
      onOk: async () => {
        try {
          const result = await TeamApi.deleteTeam(teamData.id);
          if (result) {
            message.success("Team deleted successfully");
            // Refresh contestant data to remove team reference
            await ContestantApi.getMe();
            setTeamData(null);
          }
        } catch (error) {
          message.error("Failed to delete team");
        }
      },
    });
  };

  const handleTeamAction = () => {
    if (teamData) {
      handleUpdateTeam();
    } else {
      handleCreateTeam();
    }
  };

  const renderError = () => {
    if (!serverError) return null;

    if (serverError.includes("Email is taken")) {
      return (
        <div className="text-red-500 mt-2 error-response" id="email-taken">
          {serverError}
        </div>
      );
    }

    if (serverError.includes("Username is taken")) {
      return (
        <div className="text-red-500 mt-2 error-response" id="username-taken">
          {serverError}
        </div>
      );
    }

    if (serverError.includes("Student id is taken")) {
      return (
        <div className="text-red-500 mt-2 error-response" id="student-id-taken">
          {serverError}
        </div>
      );
    }

    if (serverError.includes("Invalid email")) {
      return (
        <div className="text-red-500 mt-2 error-response" id="invalid-email">
          {serverError}
        </div>
      );
    }

    return (
      <div className="text-red-500 mt-2 error-response">{serverError}</div>
    );
  };

  if (initialLoading) {
    return (
      <div className="bg-[#F5F5F5] flex flex-col px-6 py-8 gap-6">
        <div className="flex justify-center items-center h-screen">
          <Text type="headline-4" color={Colors.PRIMARY_BLUE}>
            Loading account information...
          </Text>
        </div>
      </div>
    );
  }

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
                  <Text color={Colors.PRIMARY_BLUE} type="body-2">
                    Account
                  </Text>
                ),
              },
            ]}
          />
        </Sider>
        <div className="flex flex-col gap-6">
          <div className="flex flex-col bg-white rounded-xl px-4 py-6">
            <Text
              type="headline-4"
              color={Colors.PRIMARY_BLUE}
              className="mb-4"
            >
              Account
            </Text>
            <div className="flex flex-wrap gap-4">
              <Input
                name="email"
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
                name="first_name"
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
                name="last_name"
                className="w-[48%]"
                bordered
                label="Last name*"
                placeholder="Enter last name"
                value={form.values?.last_name}
                onChange={form.handleChange("last_name")}
                error={form.errors.last_name}
              />
              <Input
                name="username"
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
                name="student_id"
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
                  id="gender"
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
                  id="school_year"
                  label="School Year"
                  value={form.values?.affiliation?.name}
                  onChange={(value) =>
                    form.setFieldValue("affiliation", {
                      id: value,
                      name: schoolYearOptions?.find(
                        (item) => item.value === value
                      )?.label,
                    })
                  }
                  error={form.errors.affiliation?.name}
                  options={schoolYearOptions}
                />
              </div>
              {renderError()}

              <div className="w-full flex justify-center mt-4">
                <Button
                  name="save-btn"
                  // disabled={!form.dirty}
                  loading={form.isSubmitting}
                  onClick={() =>
                    console.log("🚀 ~ onClick: ~ form:", form.submitForm())
                  }
                  className="justify-center w-[200px] !h-[45px] text-xl items-center"
                >
                  Save
                </Button>
              </div>
            </div>
          </div>

          {contestant?.team ? (
            <div className="flex flex-col bg-white rounded-xl px-4 py-6">
              <Text
                type="headline-4"
                color={Colors.PRIMARY_BLUE}
                className="mb-4"
              >
                Team Information
              </Text>
              {loading ? (
                <div>Loading team information...</div>
              ) : teamData ? (
                <div className="flex flex-col gap-4">
                  <div className="flex justify-between items-center">
                    <Text type="body-1" color={Colors.GREY_800}>
                      Team Name: {teamData.name}
                    </Text>
                    <Text type="body-2" color={Colors.GREY_600}>
                      Team Size: {currentTeamSize}/{MAX_TEAM_SIZE}
                    </Text>
                  </div>
                  <div>
                    <Text
                      type="body-1"
                      color={Colors.GREY_800}
                      className="mb-2"
                    >
                      Team Members:
                    </Text>
                    <div className="flex flex-col gap-2">
                      {teamData.members.map((member) => (
                        <div
                          key={member.id}
                          className="flex items-center gap-2 p-2 bg-gray-50 rounded"
                        >
                          <Text type="body-2" color={Colors.GREY_800}>
                            {member.first_name} {member.last_name}
                          </Text>
                          <Text type="body-2" color={Colors.GREY_600}>
                            ({member.email})
                          </Text>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-4 justify-center mt-4">
                    {canAddMembers && !showTeamForm && (
                      <Button
                        onClick={() => setShowTeamForm(true)}
                        className="justify-center w-[200px] !h-[45px] text-xl items-center"
                      >
                        Add Member
                      </Button>
                    )}
                    <Button
                      onClick={handleDeleteTeam}
                      className="justify-center w-[200px] !h-[45px] text-xl items-center"
                      style={{ backgroundColor: Colors.ACCENT_RED }}
                    >
                      Delete Team
                    </Button>
                  </div>
                  {showTeamForm && (
                    <div className="flex flex-col gap-4">
                      <Input
                        type="email"
                        bordered
                        label="Member Email"
                        placeholder="Enter member email"
                        value={teamFormData.members[0]}
                        onChange={(e) =>
                          setTeamFormData((prev) => ({
                            ...prev,
                            members: [
                              e.target.value,
                              prev.members[1],
                              prev.members[2],
                            ],
                          }))
                        }
                      />
                      <div className="flex gap-4">
                        <Button
                          onClick={handleTeamAction}
                          className="justify-center w-[200px] !h-[45px] text-xl items-center"
                        >
                          Add Member
                        </Button>
                        <Button
                          onClick={() => setShowTeamForm(false)}
                          className="justify-center w-[200px] !h-[45px] text-xl items-center"
                          style={{ backgroundColor: Colors.GREY_600 }}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  )}
                  {!canAddMembers && (
                    <Text
                      type="body-2"
                      color={Colors.GREY_600}
                      className="text-center mt-2"
                    >
                      Team is at maximum capacity
                    </Text>
                  )}
                </div>
              ) : (
                <div>No team information available</div>
              )}
            </div>
          ) : (
            <div className="flex flex-col bg-white rounded-xl px-4 py-6">
              <Text
                type="headline-4"
                color={Colors.PRIMARY_BLUE}
                className="mb-4"
              >
                Create Team
              </Text>
              {!showTeamForm ? (
                <div className="flex flex-col items-center gap-4">
                  <Text type="body-1" color={Colors.GREY_800}>
                    You haven't joined any team yet. Create a new team to start
                    collaborating!
                  </Text>
                  <Button
                    onClick={handleShowTeamForm}
                    className="justify-center w-[200px] !h-[45px] text-xl items-center"
                  >
                    Create Team
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  <Input
                    type="text"
                    bordered
                    label="Team Name"
                    placeholder="Enter team name"
                    value={teamFormData.name}
                    onChange={(e) =>
                      setTeamFormData((prev) => ({
                        ...prev,
                        name: e.target.value,
                      }))
                    }
                  />
                  <Input
                    type="text"
                    bordered
                    label="Team Description"
                    placeholder="Enter team description"
                    value={teamFormData.description}
                    onChange={(e) =>
                      setTeamFormData((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                  />
                  <Input
                    type="email"
                    bordered
                    label="Your Email"
                    placeholder="Your email"
                    value={teamFormData.members[0]}
                    disabled
                  />
                  <Input
                    type="email"
                    bordered
                    label="Member Email 2"
                    placeholder="Enter second member email"
                    value={teamFormData.members[1]}
                    onChange={(e) =>
                      setTeamFormData((prev) => ({
                        ...prev,
                        members: [
                          prev.members[0],
                          e.target.value,
                          prev.members[2],
                        ],
                      }))
                    }
                  />
                  <Input
                    type="email"
                    bordered
                    label="Member Email 3"
                    placeholder="Enter third member email"
                    value={teamFormData.members[2]}
                    onChange={(e) =>
                      setTeamFormData((prev) => ({
                        ...prev,
                        members: [
                          prev.members[0],
                          prev.members[1],
                          e.target.value,
                        ],
                      }))
                    }
                  />
                  <div className="flex gap-4">
                    <Button
                      onClick={handleTeamAction}
                      className="justify-center w-[200px] !h-[45px] text-xl items-center"
                    >
                      Create Team
                    </Button>
                    <Button
                      onClick={() => setShowTeamForm(false)}
                      className="justify-center w-[200px] !h-[45px] text-xl items-center"
                      style={{ backgroundColor: Colors.GREY_600 }}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Account;
