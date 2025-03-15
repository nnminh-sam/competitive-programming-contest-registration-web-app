import { FC, useState } from "react";
import { Contest, ContestApi } from "../../services/contest";
import classNames from "classnames";
import Text from "../Text";
import Colors from "../../constants/color";
import { useMemo } from "react";
import Button from "../Button";
import RegisterModal from "../Modal/RegisterModal";
import { useRecoilValue } from "recoil";
import ContestantAtom from "../../services/contestant/contestant.atom";
import { message } from "antd";

export interface CardProps extends Partial<Contest> {
  className?: string;
  is_registered?: boolean;
}

const Card: FC<CardProps> = (props) => {
  const { className, name, banner, duration, type, id, is_registered } = props;
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const constestant = useRecoilValue(ContestantAtom.curentContestant);
  const [isRegistered, setIsRegistered] = useState(false);

  const typeColors = useMemo(() => {
    return type === "Team"
      ? "bg-green-600 text-white"
      : "bg-red-600 text-white";
  }, [type]);

  const handleSubmitContest = async () => {
    if (type === "Single") {
      ContestApi.registerSingle(id as string, constestant?.id as string).then(
        (res) => {
          if (res) {
            setIsRegisterModalOpen(false);
            setIsRegistered(true); // ✅ Update state after success
            message.success("Register success");
          }
        }
      );
    }
  };

  return (
    <>
      <div
        className={classNames(
          "relative rounded-lg overflow-hidden flex flex-col justify-center transform transition-transform duration-300 hover:scale-105 cursor-pointer items-center",
          className
        )}
      >
        {/* Banner Image */}
        {banner && (
          <img src={banner} alt={name} className="w-full h-60 object-cover" />
        )}

        {/* Duration Badge */}
        {duration && (
          <div className="absolute top-4 left-4 bg-white text-blue-600 font-semibold px-3 py-1 rounded-lg shadow-md text-sm">
            {duration} min
          </div>
        )}
        {type && (
          <div
            className={`absolute top-4 right-4 ${typeColors} font-semibold px-3 py-1 rounded-lg shadow-md text-sm`}
          >
            {type.toUpperCase()}
          </div>
        )}

        {/* Title Overlay */}
        <div className="absolute bottom-[15%] mb-4 px-4 py-3 rounded-lg w-4/5 backdrop-blur-2xl">
          <Text type="body-2" color={Colors.GREY_0} className="font-semibold">
            {name}
          </Text>
        </div>
        {!is_registered && !isRegistered && (
          <div className="absolute bottom-[3%]">
            <Button
              onClick={() => setIsRegisterModalOpen(true)}
              className="mt-2 w-full"
            >
              Register
            </Button>
          </div>
        )}
      </div>

      {/* Register Modal */}
      <RegisterModal
        cancelLabel="Cancel"
        open={isRegisterModalOpen}
        message={`Are you sure you want to register this ${type} contest?`}
        title={`Register Contest ${name}`}
        confirmLabel="Register"
        onClose={() => setIsRegisterModalOpen(false)}
        onConfirm={handleSubmitContest}
      />
    </>
  );
};

export default Card;
