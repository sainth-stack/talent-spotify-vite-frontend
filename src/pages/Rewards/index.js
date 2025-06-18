/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-mixed-operators */
/* eslint-disable array-callback-return */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useCallback, useRef } from "react";
import TitleHeader from "components/TitleHeader";
import "./styles.scss";
import SelectInput from "components/Company/SelectInput";
import BrowseFilesNormal from "components/Company/BrowseFilesNormal";
import profile from "assets/images/profile.png";
import printer from "assets/svg/printer.svg";
import vedeo from "assets/svg/vedeo.svg";
import { useLocation } from "react-router-dom";
import {
  handleLink2,
  LoadingIndicator,
  OKRperiod,
  removeDuplicates,
  RewardCategories,
  RewardTypes1,
} from "utilities";
import "./styles.scss";
import { useDispatch, useSelector } from "react-redux";
import { getEmployees } from "action/EmployeeAct";
import { getObjectivesRewardPoints } from "action/UserAct";
import useWindowSize from "components/UseWindowSize";
import { OKRperiodMonths } from "utilities";
import { Col, Row } from "react-bootstrap";
import Button from "components/Company/Button";
import { history } from "service/helpers";
import CustomLegendReward from "./CustomLegendReward";
import Toolcard from "./Toolcard/Toolcard";
import Tippy from "@tippyjs/react";
import {
  createRedeemPoints,
  getAllRedeemPoints,
  getAllRewards,
  updateRedeem,
} from "action/RewardsAct";
import Slider from "components/Slider";
import PieChartRewards from "components/DashboardComponents/PieChartRewards";
import PieChartTotalRedeems from "components/DashboardComponents/PieChartTotalRedeems";
import UserOnboarding from "react-user-onboarding";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
function Card2({ children }) {
  return <div>{children}</div>;
}
function Heading({ title }) {
  return (
    <div className="d-flex justify-content-between align-items-center p-4">
      <h6 className="font-weight-bold">{title}</h6>
    </div>
  );
}
export const tableGenerator = (data, length) => {
  const items = [];
  for (let i = 0; i < length; i++) {
    items.push({
      id: i + 1,
      _id: data[i]._id,
      rewardIcon: data[i].rewardIcon,
      rewardName: data[i].rewardName,
      rewardCode: data[i].rewardCode,
      rewardDescription: data[i].rewardDescription,
      rewardType: data[i].rewardType,
      rewardTypeCategory:
        RewardTypes1.filter((item) => item.value === data[i].rewardType)
          .length > 0
          ? "Monetory"
          : "Non Monetory",
      rewardPoints: data[i].rewardPoints,
      rewardAmount: data[i].rewardAmount,
      rewardStatus: data[i].rewardStatus,
      rewardApprover: data[i].rewardApprover,
      status: data[i].status,
      updatedAt: window.moment(data[i].updatedAt).format("MM-DD-YYYY hh:mm:ss"),
    });
  }
  return items;
};

export default function Objectives() {
  let user = useSelector((store) => store.user.user);
  let selectedTab1 =
    localStorage.getItem("selectedTab") !== null
      ? JSON.parse(localStorage.getItem("selectedTab"))
      : null;
  let selectedTab =
    localStorage.getItem("selectedTabRewards") !== null
      ? JSON.parse(localStorage.getItem("selectedTabRewards"))
      : { tab: "rewardsRedemption" };
  let companyObj = {
    companyEntityName: "",
    employeeName: "",
    employeeNames: "",
    country: "",
    status: "Active",
    userId: 1,
    _id: null,
    okrPeriod: "Monthly",
    okrYear: "2022",
    rewardType: "Monetory",
  };
  const [companyInfo, setCompanyInfo] = useState(companyObj);
  const [, setError] = useState(false);
  const [isAvailable] = useState(false);
  const dispatch = useDispatch();
  const [showAttachment, setShowAttachment] = useState(true);
  const [rewardsData, setRewardsData] = useState([]);
  const [rewardPoints, setRewardPoints] = useState(0);
  const [earnedPoints, setEarnedPoints] = useState(0);
  const [redeemedPoints, setRedeemedPoints] = useState(0);
  const [remainingPoints, setRemainingPoints] = useState(0);
  const [bronzePoints, setBronzePoints] = useState(0);
  const [silverPoints, setSilverPoints] = useState(0);
  const [goldPoints, setGoldPoints] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [empData, setEmpData] = useState([]);
  const [redeemHistory, setRedeemHistory] = useState([]);
  const [totalPoints, setTotalPoints] = useState([]);
  const isMobile = useWindowSize();
  const location = useLocation();
  const handleChange = ({ target: { name, value } }) => {
    let updatedData = { ...companyInfo };
    updatedData[name] = value;
    setCompanyInfo(updatedData);
  };
  const { t } = useTranslation();
  const empID2 = JSON.parse(localStorage.getItem("user"));
  const getUser = () => {
    let selectedTab =
      localStorage.getItem("selectedTabRewards") !== null
        ? JSON.parse(localStorage.getItem("selectedTabRewards"))
        : null;
    if (selectedTab !== null && selectedTab.tab === "rewardsRedemption") {
      history.push("/admin/rewards/rewardsRedemption");
    } else if (selectedTab !== null && selectedTab.tab === "recognize") {
      history.push("/admin/rewards/recognize");
    }
  };
  const fetchRewardPoints = useCallback(() => {
    let response2 = dispatch(
      getObjectivesRewardPoints(user._id, user.role, selectedTab1.tab)
    );
    response2.then(({ data, message }) => {
      if (data) {
        setRewardPoints(
          (
            Number(data.totalObjectivesPoints) +
            Number(data.totalKeyResultsPoints)
          ).toFixed(1)
        );
        setEarnedPoints(data.earnedPoints);
        setRedeemedPoints(data.redeemPoints);
        setRemainingPoints(data.remainingPoints);
        setBronzePoints(parseInt(data.rewardPoints));
        setSilverPoints(parseInt(data.rewardPoints2));
        setGoldPoints(parseInt(data.rewardPoints3));
        setError("");
        setLoading(false);
      } else if (data.length === 0) {
        setError("No Data Found!");
        setLoading(false);
      } else {
        setError(message);
        setLoading(false);
      }
    });
  });

  const fetchAllRedeemPoints = () => {
    let response2 = dispatch(getAllRedeemPoints(user._id));
    response2.then(({ data, message }) => {
      if (data) {
        setRedeemHistory(data.rewardTypeAndPoints);
        setTotalPoints(data.totalPoints);
        setError("");
        setLoading(false);
      } else if (data.length === 0) {
        setError("No Data Found!");
        setLoading(false);
      } else {
        setError(message);
        setLoading(false);
      }
    });
  };
  const elem1 = useRef(),
    elem2 = useRef();
  useEffect(() => {
    if (elem1.current && elem2.current) {
      setTimeout(() => {
        setIsVisible(location.state ? location.state.isVisible : false);
        window.history.replaceState({ isVisible: false }, document.title);
      }, 200);
    }
  }, [location, elem1, elem2]);
  useEffect(() => {
    getUser();
    fetchRewardPoints();
    fetchAllRedeemPoints();
  }, []);
  const story = [
    {
      component: "tooltip",
      ref: elem1,
      children: (
        <div>
          <p>Here we can view the reward points</p>
        </div>
      ),
    },
    {
      component: "modal",
      tooltipID: "#getStarted",
      verticalPosition: "center",
      horizontalPosition: "center",
      intro: false,
      children: (
        <div>
          <p>Thanks {empID2.name}!</p>

          <p>You have completed The Onboarding Process.</p>
        </div>
      ),
    },
  ];
  const story1 = [
    {
      component: "tooltip",
      ref: elem2,
      children: (
        <div>
          <p>Here we can Redeem The rewards by selecting the reward type</p>
        </div>
      ),
    },
    {
      component: "modal",
      tooltipID: "#getStarted",
      verticalPosition: "center",
      horizontalPosition: "center",
      intro: false,
      children: (
        <div>
          <p>Thanks {empID2.name}!</p>
          <p>You have completed The Onboarding Process.</p>
        </div>
      ),
    },
  ];
  const getStory = () => {
    if (location.state.story === "story") {
      return story;
    } else if (location.state.story === "story1") {
      return story1;
    }
  };

  const fetchEmployees = () => {
    try {
      setLoading(true);
      let response = dispatch(getEmployees());
      response.then(({ data, message }) => {
        if (data !== undefined && data.length > 0) {
          let updatedData = data
            .filter((item) => {
              if (selectedTab1 !== null && selectedTab1.tab === "me") {
                if (user !== null && item._id === user._id) {
                  return item;
                }
              } else {
                if (
                  (user !== null &&
                    item.employmentInformation &&
                    item.employmentInformation.lineManager &&
                    item.employmentInformation.lineManager === user._id) ||
                  item._id === user._id
                ) {
                  return item;
                }
              }
            })
            .map((item) => {
              return {
                key:
                  item.personalInformation.firstName +
                  " " +
                  item.personalInformation.lastName,
                value: item._id,
              };
            });
          let nonduplicates = removeDuplicates(updatedData, "key");
          let updatedData2 = { ...companyInfo };
          updatedData2["employeeName"] = nonduplicates[0].value;
          updatedData2["employeeNames"] = nonduplicates[0].key;
          if (localStorage.getItem("userData") === null) {
            localStorage.setItem(
              "userData",
              JSON.stringify({
                ownerName: updatedData.filter(
                  (item) => item.value === updatedData2.employeeName
                )[0].key,
                ownerId: updatedData2.employeeName,
              })
            );
          } else {
            let existingUser =
              localStorage.getItem("userData") !== null
                ? JSON.parse(localStorage.getItem("userData"))
                : null;
            if (existingUser !== null) {
              updatedData2["employeeName"] = existingUser.ownerId;
              updatedData2["employeeNames"] = existingUser.ownerName;
            }
          }
          setCompanyInfo(updatedData2);
          setEmpData(nonduplicates);
          setLoading(false);
          setError("");
        } else if (data.length === 0) {
          setLoading(false);
          setError("No Data Found!");
        } else {
          setLoading(false);
          setError(message);
        }
      });
    } catch (error) {
      setLoading(false);
      setError(error.toString());
    }
  };

  const getRewardsData = () => {
    try {
      setLoading(true);
      let response = dispatch(getAllRewards());
      response.then(({ data, message }) => {
        if (data !== undefined && data.length > 0) {
          let nonduplicate = removeDuplicates(data, "rewardName");
          nonduplicate = tableGenerator(data, data.length);
          setRewardsData(nonduplicate);
          setLoading(false);
          setError("");
        } else if (data.length === 0) {
          setLoading(false);
          setError("No Data Found!");
        } else {
          setLoading(false);
          setError(message);
        }
      });
    } catch (error) {
      setLoading(false);
      setError(error.toString());
    }
  };
  useEffect(() => {
    fetchEmployees();
    getRewardsData();
    //eslint-disable-next-line
  }, []);
  const handleSelect = (points, amount, rewardId) => {
    try {
      setLoading(true);
      let response = dispatch(
        createRedeemPoints({ points, amount, userId: user._id, rewardId })
      );
      response.then(({ data, message }) => {
        setLoading(false);
        setError("");
        getRewardsData();
        fetchRewardPoints();
        fetchAllRedeemPoints();
      });
    } catch (error) {
      setLoading(false);
      setError(error.toString());
    }
  };
  const handleUpdate = (rewardId, status) => {
    try {
      setLoading(true);
      let response = dispatch(updateRedeem(rewardId, { status }));
      response.then(({ data, message }) => {
        setLoading(false);
        setError("");
        getRewardsData();
        fetchRewardPoints();
        fetchAllRedeemPoints();
      });
    } catch (error) {
      setLoading(false);
      setError(error.toString());
    }
  };
  return (
    <>
      <TitleHeader name={t("Rewards.title")} />
      <div
        className={`rounded-12 mh-100 ${
          isMobile ? "p-1 m-1" : "bg-light-primary p-4 m-4"
        }`}
      >
        <div>
          <div
            onClick={() =>
              handleLink2(
                "/admin/rewards/rewardsRedemption",
                "rewardsRedemption"
              )
            }
            className={`text-decoration-none nav cursor-pointer ${
              selectedTab.tab === "rewardsRedemption" ? "activeLink" : ""
            }`}
          >
            {t("Rewards.title")}
          </div>
        </div>
        <div className="type">
          {selectedTab.tab === "rewardsRedemption" ? (
            <h5>{t("Rewards.rewards")}</h5>
          ) : (
            <h5>{t("Rewards.appreciation")}</h5>
          )}
        </div>
        {selectedTab.tab === "rewardsRedemption" ? (
          <>
            <Row className="mt-5">
              <Col lg="5">
                <SelectInput
                  label={t("Rewards.employee")}
                  placeholder="--Select--"
                  name="employeeName"
                  options={empData}
                  value={companyInfo.employeeName}
                  onChangeText={(e) => {
                    handleChange(e);
                    localStorage.setItem(
                      "userData",
                      JSON.stringify({
                        ownerName: e.target.label,
                        ownerId: e.target.value,
                      })
                    );
                  }}
                  disabled={isAvailable}
                />
              </Col>
              <Col lg="4">
                <SelectInput
                  label={t("Rewards.period")}
                  placeholder=""
                  name="okrPeriod"
                  options={OKRperiodMonths}
                  value={companyInfo.okrPeriod}
                  disabled={isAvailable}
                  onChangeText={handleChange}
                />
              </Col>
            </Row>
            <Row className="mt-3">
              <Col>
                <div className="charts-card">
                  <Card2 isMobile={isMobile}>
                    <Heading title={t("Rewards.cardTitle")} />
                    <div className="d-flex flex-wrap pb-4 pl-2">
                      <div className="col-md-3">
                        {redeemHistory.length > 0 ? (
                          <PieChartTotalRedeems redeemHistory={redeemHistory} />
                        ) : (
                          <h3 className="text-danger">
                            {t("Rewards.notFound")}
                          </h3>
                        )}
                      </div>
                      <div
                        className={isMobile ? "d-flex" : "custom-legend-reward"}
                      >
                        <div className="custom-legend-div">
                          {redeemHistory.length > 0 &&
                            redeemHistory.map((redeem, index) => (
                              <CustomLegendReward
                                title={redeem.rewardType + " - " + redeem.total}
                                color={
                                  [
                                    "green",
                                    "blue",
                                    "red",
                                    "brown",
                                    "orange",
                                    "black",
                                    "navy",
                                    "yellow",
                                  ][index]
                                }
                              />
                            ))}
                        </div>
                      </div>
                    </div>
                  </Card2>
                </div>
              </Col>
            </Row>
            <div className="mt-3 charts-card">
              <h5 className="p-4 font-weight-bold">
                {t("Rewards.redemption")}
              </h5>
              <div className="d-flex justify-content-between flex-wrap">
                <div className="d-flex flex-wrap pie col-md-7 mt-3">
                  <div className="pl-3 pieChart">
                    {remainingPoints && (
                      <PieChartRewards
                        redeemed={redeemedPoints}
                        remaining={remainingPoints}
                      />
                    )}
                  </div>
                  <div className="giveAway">
                    <div ref={elem1}>
                      {remainingPoints > 0 && (
                        <>
                          {t("Rewards.congratulations")} {user?.name},<br />
                          {t("Rewards.earnedPoints")}
                          <p
                            className="mb-0 p-2"
                            style={{
                              fontWeight: 900,
                              fontSize: "40px",
                              textAlign: "center",
                            }}
                          >
                            {remainingPoints}
                          </p>
                          <p className="mb-0">
                            {t("Rewards.before")}
                            <br /> {t("Rewards.claim")}
                          </p>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <div className="col-md-5">
                  {remainingPoints && (
                    <Slider
                      bronze={bronzePoints}
                      silver={silverPoints}
                      gold={goldPoints}
                      progressStatus={remainingPoints / 10}
                      disabled
                    />
                  )}
                  <div className="d-flex justify-content-between">
                    <p>{t("Rewards.bronze")}</p>
                    <p>{t("Rewards.silver")}</p>
                    <p>{t("Rewards.gold")}</p>
                  </div>
                  <div>
                    {remainingPoints > 0 && (
                      <p className="text-center">
                        {remainingPoints < silverPoints
                          ? silverPoints - remainingPoints
                          : goldPoints - remainingPoints}{" "}
                        {t("Rewards.morePoints")}{" "}
                        <b>
                          {remainingPoints < silverPoints
                            ? t("Rewards.silver")
                            : t("Rewards.gold")}
                        </b>
                      </p>
                    )}
                  </div>
                </div>
              </div>
              <div className="col-md-5" ref={elem2}>
                <SelectInput
                  label={t("Rewards.rewardType")}
                  placeholder=""
                  name="rewardType"
                  options={RewardCategories}
                  value={companyInfo.rewardType}
                  onChangeText={handleChange}
                />
              </div>
              <div className="parentReward">
                {loading ? (
                  <LoadingIndicator />
                ) : (
                  rewardsData.length > 0 &&
                  rewardsData
                    .filter(
                      (reward) => reward.rewardType === companyInfo.rewardType
                    )
                    .map((reward, index) => (
                      <Tippy
                        content={
                          <Toolcard
                            reward={reward}
                            role={user.role}
                            userPoints={earnedPoints}
                            handleSelect={handleSelect}
                            handleUpdate={handleUpdate}
                          />
                        }
                        placement="right"
                        className="hover"
                        interactive={true}
                      >
                        <div
                          className={`col-md-3 card2 ml-4  p-2 mt-2 mb-2 ${
                            earnedPoints < reward.rewardPoints ||
                            reward.status === "approved" ||
                            reward.status === "in progress"
                              ? "bg-light"
                              : ""
                          }`}
                        >
                          <div className="d-flex justify-content-center">
                            <img
                              src={reward.rewardIcon}
                              alt="reward logo"
                              className="rewardlogo"
                            />
                          </div>
                          <h3 className="rewardtitle">{reward.rewardName}</h3>
                          <h5
                            className={`${
                              earnedPoints < reward.rewardPoints ||
                              reward.status === "approved" ||
                              reward.status === "in progress"
                                ? "text-dark text-center h6"
                                : "text-success text-center h6"
                            }`}
                          >
                            {reward.rewardPoints}
                          </h5>
                          <h5
                            className={`${
                              earnedPoints < reward.rewardPoints ||
                              reward.status === "approved" ||
                              reward.status === "in progress"
                                ? "text-dark text-center h6"
                                : "text-success text-center h6"
                            }`}
                          >
                            {earnedPoints < reward.rewardPoints ||
                            reward.status === "approved" ||
                            reward.status === "in progress"
                              ? null
                              : t("Rewards.eligible")}
                          </h5>
                          <hr />
                          <h5 className="rewardcode">{reward.rewardCode}</h5>
                          {/*<h6 className="rewarddiscount text-center">{reward.rewardDescription}</h6>*/}
                          <div className="text-center">
                            <h5 className="text-default text-center">
                              {reward.rewardType}
                            </h5>
                          </div>
                          {reward.status !== "pending" && (
                            <h6
                              className={`text-uppercase text-center text-${
                                reward.status === "approved"
                                  ? "success"
                                  : "warning"
                              }`}
                            >
                              {reward.status}
                            </h6>
                          )}
                        </div>
                      </Tippy>
                    ))
                )}
              </div>
            </div>
          </>
        ) : (
          <>
            <Row className="mt-5">
              <Col>
                <div className="d-flex justify-content-start">
                  <label className="label fs-14 col-md-4 col-xs-12 col-sm-12 employee">
                    Employee
                  </label>

                  <p className="fs-14 font-weight-light">Nandhini Clament</p>
                </div>
              </Col>
              <Col>
                <SelectInput
                  label="Other Participants Contribute"
                  placeholder=""
                  name="okrPeriod"
                  options={OKRperiod}
                  value={companyInfo.okrPeriod}
                  disabled={isAvailable}
                />
              </Col>
            </Row>
            <div className="form-group d-flex mt-4">
              <label
                htmlFor="comment"
                className={isMobile ? "mr-5 col-3 m-0 p-0" : "mr-5"}
              >
                Comments
              </label>
              <textarea
                id="comments"
                className={`form-control p-2 ${
                  isMobile ? "mr-1" : "col-4 ml-5 "
                }`}
                rows="5"
                name="comments"
              ></textarea>
            </div>
            {showAttachment ? (
              <div
                className={
                  isMobile ? "d-flex justify-content-between" : "d-flex w-50 "
                }
              >
                <label
                  htmlFor="comment"
                  className={isMobile ? "col-2 p-0 m-0" : "col-4 file  "}
                >
                  {t("Tasks.Upload Files")}
                </label>
                <BrowseFilesNormal
                  className="col-12"
                  setData={({ url }) => {
                    handleChange({
                      target: { name: "attachments", value: url },
                    });
                    setShowAttachment(!showAttachment);
                  }}
                />
              </div>
            ) : (
              <div className="d-flex browse-border align-items-center ">
                <Link href="" target="_blank" rel="noopener noreferrer">
                  View Attachment
                </Link>
                <button
                  className="btn btn-primary"
                  onClick={() => setShowAttachment(!showAttachment)}
                >
                  Reupload Attachment
                </button>
              </div>
            )}
            <div>
              <Button
                text="import"
                className="bg-green border text-white import"
              />
            </div>
            <div className="d-flex justify-content-center mt-5">
              <div className="d-flex  justify-content-start private">
                <input type="checkbox" id="selectAll" />{" "}
                <label htmlFor="selectAll" className="cursor-pointer ">
                  private
                </label>
              </div>
              <div className="d-flex justify-content-start public">
                <input type="checkbox" id="selectAll" />
                <label htmlFor="selectAll" className="cursor-pointer ">
                  public
                </label>
              </div>
            </div>
            <div className="buttons ">
              <Button
                text="Schedule"
                className="bg-white border-grey text-grey "
              />
              <Button text="Send Now" className="bg-green border text-white " />
            </div>
            <div className="mt-5 line">
              <hr />
            </div>
            <div>
              <div
                className={`text-decoration-none nav cursor-pointer ${
                  selectedTab.tab === "me" ? "activeLink" : ""
                }`}
              >
                GIVEN
              </div>
              <div
                className={`text-decoration-none nav ml-5 ${
                  selectedTab.tab === "RECEIVED" ? "activeLink" : ""
                } cursor-pointer`}
              >
                {user.role === "Manager" ? "My team" : "RECEIVED"}
              </div>
            </div>
            <div className="d-flex  mt-4">
              <img className="pic" src={profile} alt="profile" />
              <div className="board ">
                <Button
                  text="View Board"
                  className="bg-green border text-white "
                />
              </div>
            </div>
            <div className="d-flex head2 ">
              <div className="for">FOR</div>
              <div className="nandhi">Nandhini Clament</div>
              <div className="min">Min board</div>
            </div>
            <hr />
            <div className="d-flex justify-content-between">
              <div className="d-flex create ">
                <div>Creator</div>
                <div className="created">Created</div>
              </div>
              <div className="d-flex justify-content-end ">
                <img src={printer} alt={printer} />
                <img className="ml-2" src={vedeo} alt={vedeo} />
              </div>
            </div>
            <div className="d-flex ">
              <div className="name">Yesu clament david</div>
              <div className="date">May 14, 2021</div>
            </div>
            <div className="d-flex">
              <div className="post">posts</div>
              <div className="redeem">
                <Button text="Redeem" className="redeem border-grey  " />
              </div>
              <div className="lastpost">Last post added</div>
            </div>
            <div className="d-flex mt-1">
              <div className="max">1 (Max of 10)</div>
              <div className="time">1 minute ago</div>
            </div>
          </>
        )}
      </div>
      <UserOnboarding
        story={location.state ? getStory() : []}
        isVisible={isVisible}
        onClose={() => {
          setIsVisible(false);
        }}
      />
    </>
  );
}
