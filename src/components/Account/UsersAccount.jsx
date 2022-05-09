import React, { useEffect, useState, useCallback } from "react";
import { ethers } from "ethers";
import {
  Select,
  Layout,
  Menu,
  Image,
  Input,
  Divider,
  Space,
  Avatar,
  Typography,
  Spin,
  Empty,
} from "antd";
import {
  HeartOutlined,
  CopyOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  PictureOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import styled from "styled-components";
import AssetCard from "../Common/AssetCard.jsx";
import FilterSider from "../Common/FilterSider";
import CollectionCard from "../Common/CollectionCard";
import { useDispatch, useSelector } from "react-redux";
import { getOwnedAsset } from "../../state/action/ownedAssetsAction";
import { getOwnedCollection } from "../../state/action/ownedCollectionAction";
import { getFavoriteAsset } from "../../state/action/favoriteAssetsAction";
import { toast } from "react-toastify";
import axios from "axios";
import { useParams } from "react-router-dom";
const { Header, Sider, Content } = Layout;
const { Search } = Input;
const { Option } = Select;
const { Title, Paragraph } = Typography;

const StyledLayout = styled(Layout)`
  height: 100vh;
`;

const StyledProfileLayout = styled.div`
  display: flex;
  margin: 0 auto;
  width: 80%;
  height: 200px;
`;

const StyledAvatar = styled(Avatar)`
  position: relative;
  border: 2px solid #fff;
  top: -70px;
`;

const StyledBannerImage = styled(Image)`
  width: 100vw;
  height: 30vh;
`;

const StyledFallback = styled.div`
  background-color: #e8e6e6;
  width: 100vw;
  height: 30vh;
`;

const StyledSelect = styled(Select)`
  width: 300px;
  border: 1px solid #d9d9d9;
  border-radius: 3px;

  .ant-select-selector {
    border: none !important;
  }
`;

const StyledHeader = styled(Header)`
  background-color: #fff;
  height: 45px;
  line-height: 0px;
  padding-left: 10px;
`;

const StyledHR = styled.hr`
  width: 80%;
  margin: 0 auto;
  margin-bottom: 20px;
`;

const StyledContent = styled(Content)`
  display: flex;
  flex-wrap: wrap;
  padding-top: 20px;
  padding-left: 20px;
  gap: 20px;
  height: 10000px;
  align-content: flex-start;
  background-color: #fff;

  @media (max-width: 912px) {
    padding-left: 50px;
  }
`;

const loadingIcon = <LoadingOutlined style={{ fontSize: 70 }} spin />;

const Account = () => {
  const dispatch = useDispatch();
  const [bannerImage, setBannerImage] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  const [collapsed, setCollapsed] = useState(false);
  const [ellipsis, setEllipsis] = useState(true);
  const [loading, setLoading] = useState(true);
  const [menuSelected, setMenuSelected] = useState("1");
  // const user = useSelector((state) => state.user);
  const { id } = useParams();
  const ownedAssets = useSelector((state) => state.ownedAssets);
  const ownedCollections = useSelector((state) => state.ownedCollections);
  // const favoriteAssets = useSelector((state) => state.favoriteAssets);
  const [user, setUser] = useState({});
  const [assets, setAssets] = useState([]);
  const [collections, setCollections] = useState([]);
  const [favoriteAssets, setFavoriteAssets] = useState([]);

  useEffect(() => {
    getUser();
    setLoading(false);
  }, [getUser]);

  useEffect(() => {
    if (Object.keys(user).length !== 0) {
      getAssetsAndCollections(user._id);
      setImg();
    }
  }, [user]);

  const getUser = async () => {
    await axios
      .get(
        `${process.env.REACT_APP_API_URL}/users/get-user?walletAddress=${id}`
      )
      .then((res) => {
        setUser(res.data);
      });
  };

  const setImg = () => {
    if (user.bannerImg) {
      setBannerImage(user.bannerImage);
    }

    if (user.profileImg) {
      setProfileImage(user.profileImage);
    }
  };

  const getAssetsAndCollections = async (id) => {
    // dispatch(getOwnedAsset(id)).catch(() => {
    //   toast.error("Error fetching owned assets");
    // });
    await axios
      .get(`${process.env.REACT_APP_API_URL}/users/owned-assets?id=${id}`)
      .then(({ data }) => {
        setAssets(data.ownedAssets);
      })
      .catch(() => {
        toast.error("Error fetching collected assets");
      });
    await axios
      .get(`${process.env.REACT_APP_API_URL}/users/owned-collections?id=${id}`)
      .then(({ data }) => {
        setCollections(data.ownedCollections);
      })
      .catch(() => {
        toast.error("Error fetching owned collections");
      });
    await axios
      .get(`${process.env.REACT_APP_API_URL}/users/favorite-assets?id=${id}`)
      .then(({ data }) => {
        setFavoriteAssets(data.favoriteAssets);
      })
      .catch(() => {
        toast.error("Error fetching favorite assets");
      });

    // dispatch(getOwnedCollection(id)).catch(() => {
    //   toast.error("Error fetching owned collections");
    // });
    // dispatch(getFavoriteAsset(id)).catch(() => {
    //   toast.error("Error fetching favorite assets");
    // });
  };

  const toggleSider = () => {
    setCollapsed(!collapsed);
  };

  const handleCategoriesChange = (value) => {
    console.log(`selected ${value}`);
  };

  const handleCategoriesSearch = (value) => {
    console.log(`search ${value}`);
  };

  const handleMenuSelect = (e) => {
    setMenuSelected(e.key);
  };

  const renderAssetsAndCollection = () => {
    switch (menuSelected) {
      case "1":
        return (
          <>
            {assets.length > 0 ? (
              assets
                .filter((asset) => asset.status != "Not Listing")
                .map((asset) => <AssetCard key={asset._id} asset={asset} />)
            ) : (
              <div style={{ width: "90%", margin: "0 auto" }}>
                <Empty description={<span>User don't have any assets.</span>} />
              </div>
            )}
          </>
        );
      case "2":
        return (
          <>
            {favoriteAssets.length > 0 ? (
              favoriteAssets.map((asset) => (
                <AssetCard key={asset._id} asset={asset} />
              ))
            ) : (
              <div style={{ width: "90%", margin: "0 auto" }}>
                <Empty
                  description={<span>User don't have any favorites.</span>}
                />
              </div>
            )}
          </>
        );
      case "3":
        return (
          <>
            {collections.length > 0 ? (
              collections.map((collection) => (
                <CollectionCard key={collection._id} collection={collection} />
              ))
            ) : (
              <div style={{ width: "90%", margin: "0 auto" }}>
                <Empty
                  description={<span>User don't have any collections</span>}
                />
              </div>
            )}
          </>
        );
      default:
        break;
    }
  };

  return (
    <Spin spinning={loading} indicator={loadingIcon}>
      <div>
        {bannerImage ? (
          <StyledBannerImage src={bannerImage} />
        ) : (
          <StyledFallback />
        )}
        <StyledProfileLayout>
          {profileImage ? (
            <StyledAvatar size={150} src={profileImage} />
          ) : (
            <StyledAvatar size={150} icon={<HeartOutlined />} />
          )}
          <div style={{ width: "50%", wordBreak: "break-all" }}>
            <Space direction="vertical" size={0} style={{ marginLeft: "10px" }}>
              <Title level={3}>{user.name ? user.name : "Default"}</Title>
              <Title level={5}>
                {user.walletAddress ? user.walletAddress : "0x0000"}
              </Title>
              <Paragraph
                ellipsis={
                  ellipsis
                    ? { rows: 2, expandable: true, symbol: "more" }
                    : false
                }
              >
                {user.bio ? user.bio : ""}
              </Paragraph>
            </Space>
          </div>
        </StyledProfileLayout>
      </div>
      <StyledHR />
      <StyledLayout hasSider>
        <Sider
          collapsible
          collapsed={collapsed}
          onCollapse={toggleSider}
          trigger={null}
          breakpoint="lg"
          collapsedWidth="40"
          theme="light"
          width="300px"
        >
          <Menu
            mode="inline"
            defaultSelectedKeys={["1"]}
            onSelect={handleMenuSelect}
          >
            <Menu.Item key="1" icon={<CopyOutlined />}>
              Collected
            </Menu.Item>
            <Menu.Item key="2" icon={<HeartOutlined />}>
              Favorited
            </Menu.Item>
            <Menu.Item key="3" icon={<PictureOutlined />}>
              Owned Collection
            </Menu.Item>
            <FilterSider />
          </Menu>
        </Sider>
        <Layout className="site-layout">
          <StyledHeader className="site-layout-background">
            <Space
              align="center"
              split={<Divider type="vertical" />}
              size="small"
              style={{ marginTop: "5px" }}
            >
              {collapsed ? (
                <MenuUnfoldOutlined
                  onClick={toggleSider}
                  style={{ fontSize: "25px" }}
                />
              ) : (
                <MenuFoldOutlined
                  onClick={toggleSider}
                  style={{ fontSize: "25px" }}
                />
              )}
              <StyledSelect
                showSearch
                placeholder="Select category"
                optionFilterProp="children"
                onChange={handleCategoriesChange}
                onSearch={handleCategoriesSearch}
                filterOption={(input, option) =>
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >=
                  0
                }
              >
                <Option value="jack">Jack</Option>
                <Option value="lucy">Lucy</Option>
                <Option value="tom">Tom</Option>
              </StyledSelect>
              <Search
                placeholder="Search"
                allowClear
                enterButton
                style={{ width: "300px" }}
              />
            </Space>
          </StyledHeader>
          <StyledContent>
            {renderAssetsAndCollection()}

            {/* <AssetCard collapsed={collapsed} />
            <AssetCard collapsed={collapsed} />
            <AssetCard collapsed={collapsed} />
            <AssetCard collapsed={collapsed} />
            <AssetCard collapsed={collapsed} />
            <AssetCard collapsed={collapsed} />
            <AssetCard collapsed={collapsed} /> */}
          </StyledContent>
        </Layout>
      </StyledLayout>
    </Spin>
  );
};

export default Account;
