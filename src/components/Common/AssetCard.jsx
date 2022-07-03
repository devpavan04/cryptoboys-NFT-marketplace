import React, { useState } from "react";
import { Card, Space, Tooltip } from "antd";
import styled from "styled-components";
import Icon, { HeartOutlined } from "@ant-design/icons";
import { ReactComponent as Ethereum } from "../../assets/icons/ethereum.svg";
import { useHistory } from "react-router-dom";

const StyledCard = styled(Card)`
  border-radius: 10px;
  transition: all 0.3s ease;
  cursor: pointer;

  .ant-card-body {
    padding: 0;
  }
`;

const StyledCardContent = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

const StyledSpace = styled(Space)`
  margin-top: 10px;
`;

const HeartStyle = {
  marginLeft: "10px",
  fontSize: "18px",
};

const StyledCardInfo = styled.span`
  position: relative;
  left: 180px;
  font-size: 12px;
  font-weight: bold;
  color: gray;
`;

const ThumbStyle = styled.iframe`
  html body img {
    width: 100%;
  }
`;

const StyledCountNumber = styled.span`
  font-size: 13px;
  font-weight: bold;
  color: gray;
  margin-left: 5px;
  position: relative;
  top: 3px;
`;

const EthereumIcon = (props) => <Icon component={Ethereum} {...props} />;

const AssetCard = (props) => {
  const { asset } = props;
  const history = useHistory();
  const collapsed = props.collapsed;
  const [favorited, setFavorited] = useState(false);

  const getFrameByTypeThumb = () => {
    switch (asset.thumb_type) {
      case 0:
        return (
          <img
            alt="example"
            src={asset.uriID}
            style={{
              objectFit: "contain",
              width: "300px",
              height: "310px",
              borderRadius: "10px 10px 0px 0px",
            }}
          />
        );
      case 1:
        return (
          <ThumbStyle
            src={asset.uriID}
            style={{
              width: "300px",
              height: "310px",
              borderRadius: "10px 10px 0px 0px",
            }}
          />
        );
      default:
        return (
          <img
            alt="example"
            src={asset.uriID}
            style={{
              width: "300px",
              height: "310px",
              borderRadius: "10px 10px 0px 0px",
            }}
          />
        );
    }
  };

  return (
    <StyledCard
      className={props.className}
      onClick={() => {
        // console.log(asset);
        history.push(`/assets/${asset._id}`);
      }}
      hoverable={true}
      style={{
        width: "300px",
        height: "420px",
      }}
      cover={getFrameByTypeThumb()}
    >
      <StyledCardContent>
        <StyledSpace
          direction="vertical"
          size={0}
          style={{ marginLeft: "10px" }}
        >
          <p style={{ marginBottom: "0px", color: "gray" }}>
            {asset.currentCollection.name}
          </p>
          <p style={{ fontWeight: "bold" }}>{asset.name}</p>
        </StyledSpace>

        <StyledSpace
          direction="vertical"
          size={0}
          style={{ marginRight: "5px", textAlign: "right" }}
        >
          <p style={{ marginBottom: "0px", color: "gray" }}>
            {asset.status == "On Auction" ? "Starting Bid" : "Price"}
          </p>
          <Space direction="horizontal" size={0}>
            <EthereumIcon
              style={{
                fontSize: "15px",
                position: "relative",
                top: "-12px",
                left: "-5px",
              }}
            />
            <p style={{ fontWeight: "bold" }}>
              {asset.currentPrice !== 0 ? asset.currentPrice : 0}
            </p>
          </Space>
        </StyledSpace>
      </StyledCardContent>
      <hr style={{ marginTop: "5px", marginBottom: "2px" }} />

      <HeartOutlined style={HeartStyle} />
      <StyledCountNumber>{asset.favoriteCount}</StyledCountNumber>

      <StyledCardInfo
        style={{ left: asset.status == "Sale" ? "225px" : "180px" }}
      >
        {asset.status}
      </StyledCardInfo>
    </StyledCard>
  );
};

export default AssetCard;
