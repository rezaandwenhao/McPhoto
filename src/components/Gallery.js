import React, { Component } from 'react';
import Rodal from 'rodal';
import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Image from 'react-bootstrap/Image'
import { FaSearch } from 'react-icons/fa';
import { Dropdown } from 'semantic-ui-react';
import Pagination from './Pagination';
import axios from 'axios';
import '../css/Gallery.css';
import 'antd/dist/antd.css';
import 'rodal/lib/rodal.css';
import { Tag, Descriptions, Modal } from 'antd';
import {
  FolderOpenOutlined,
  ShoppingCartOutlined,
  DownloadOutlined
} from '@ant-design/icons';

const PAGE_LIMIT = 6;
const PAGE_NEIGHBORS = 1;
const priceRange0To50 = '0-50$';
const priceRange50To100 = '50-100$';
const priceRange100To150 = '100-150$';
const priceRange150To200 = '150-200$';
const priceRangeOver200 = 'over 200$';
const NONE = 'None';
const PHOTOGRAPH = 'Photograph';
const PAINTING = 'Painting';
const SCULPTURE = 'Sculpture';

const priceRanges = [
  {
    key: priceRange0To50,
    text: priceRange0To50,
    value: priceRange0To50
  },
  {
    key: priceRange50To100,
    text: priceRange50To100,
    value: priceRange50To100
  },
  {
    key: priceRange100To150,
    text: priceRange100To150,
    value: priceRange100To150
  },
  {
    key: priceRange150To200,
    text: priceRange150To200,
    value: priceRange150To200
  },
  {
    key: priceRangeOver200,
    text: priceRangeOver200,
    value: priceRangeOver200
  },
  {
    key: NONE,
    text: NONE,
    value: NONE
  }
];

const mediums = [
  {
    key: PHOTOGRAPH,
    text: PHOTOGRAPH,
    value: PHOTOGRAPH
  },
  {
    key: PAINTING,
    text: PAINTING,
    value: PAINTING
  },
  {
    key: SCULPTURE,
    text: SCULPTURE,
    value: SCULPTURE
  },
  {
    key: 'Glass Art',
    text: 'Glass Art',
    value: 'Glass Art'
  },
  {
    key: 'Drawing & Illustration',
    text: 'Drawing & Illustration',
    value: 'Drawing & Illustration'
  },
  {
    key: 'Mixed Media & Collage',
    text: 'Mixed Media & Collage',
    value: 'Mixed Media & Collage'
  },
  {
    key: 'Fibre Arts',
    text: 'Fibre Arts',
    value: 'Fibre Arts'
  },
  {
    key: 'Dolls & Miniatures',
    text: 'Dolls & Miniatures',
    value: 'Dolls & Miniatures'
  },
  {
    key: 'Other',
    text: 'Other',
    value: 'Other'
  },
  {
    key: NONE,
    text: NONE,
    value: NONE
  }
];

const sortOptions = [
  {
    key: 'price',
    text: 'Price',
    value: 'price'
  },
  {
    key: 'creationTime',
    text: 'Upload Date',
    value: 'creationTime'
  },
  {
    key: NONE,
    text: NONE,
    value: NONE
  }
];

export default class Gallery extends Component {
  constructor(props) {
    super(props);
    this.sendTransaction = this.sendTransaction.bind(this);
  }

  state = {
    totalArtworks: 0,
    currentArtworks: [],
    currentPage: 1,
    totalPages: null,
    apiParams: new URLSearchParams(),
    keyword_search: '',
    // Modal related
    overlay_visible: false,
    artwork: new Object()
  };

  componentDidMount() {
    axios({
      method: 'get',
      url: 'http://localhost:3001/api/v1/arts/artworksNum'
    }).then(response => {
      this.setState({ totalArtworks: response.data.results });
    });
  }

  componentDidUpdate(prevProps, prevState) {
    // Set any Filter by or Sort by or Search keyword will update the apiParams in the state
    // which will trigger componentDidUpdate(), so here we send the new query api call

    const { apiParams, currentPage } = this.state;
    if (apiParams !== prevState.apiParams) {
      // Update the total number of artworks searched
      axios({
        method: 'get',
        url: 'http://localhost:3001/api/v1/arts/artworksNum',
        params: apiParams
      }).then(response => {
        this.setState({
          totalArtworks: response.data.results
        });
      });

      // Update the artworks on the current page(the 1st page)
      axios({
        method: 'get',
        url: `http://localhost:3001/api/v1/arts/artworks?page=${currentPage}&limit=${PAGE_LIMIT}`,
        params: apiParams
      }).then(response => {
        const currentArtworks = response.data.data.artworks;
        this.setState({ currentArtworks });
      });
    }
  }

  onPageChanged = data => {
    const { currentPage, totalPages, pageLimit } = data;
    axios({
      method: 'get',
      url: `http://localhost:3001/api/v1/arts/artworks?page=${currentPage}&limit=${pageLimit}`,
      params: this.state.apiParams
    }).then(response => {
      const currentArtworks = response.data.data.artworks;
      this.setState({
        currentPage,
        currentArtworks,
        totalPages
      });
    });
  };

  addColorTag = e => {
    if (e === 'Photograph') return 'magenta';
    else if (e === 'Painting') return 'red';
    else if (e === 'Sculpture') return 'volcano';
    else if (e === 'Glass Art') return 'orange';
    else if (e === 'Drawing & illustration') return 'gold';
    else if (e === 'Mixed Media & Collage') return 'lime';
  };

  handlePriceChange = (e, { value }) => {
    let newParams = new URLSearchParams(this.state.apiParams);
    newParams.delete('price[gte]');
    newParams.delete('price[lt]');
    if (value === priceRange0To50) {
      newParams.append('price[gte]', 0);
      newParams.append('price[lt]', 50);
    } else if (value === priceRange50To100) {
      newParams.append('price[gte]', 50);
      newParams.append('price[lt]', 100);
    } else if (value === priceRange100To150) {
      newParams.append('price[gte]', 100);
      newParams.append('price[lt]', 150);
    } else if (value === priceRange150To200) {
      newParams.append('price[gte]', 150);
      newParams.append('price[lt]', 200);
    } else if (value === priceRangeOver200) {
      newParams.append('price[gte]', 200);
    }
    this.setState({ apiParams: newParams, currentPage: 1 });
  };

  handleMediumChange = (e, { value }) => {
    let newParams = new URLSearchParams(this.state.apiParams);
    newParams.delete('medium');
    if (value !== NONE) {
      newParams.append('medium', value);
    }
    this.setState({ apiParams: newParams, currentPage: 1 });
  };

  handleSortChange = (e, { value }) => {
    let newParams = new URLSearchParams(this.state.apiParams);
    newParams.delete('sort');
    if (value !== NONE) {
      newParams.append('sort', value);
    }
    this.setState({ apiParams: newParams, currentPage: 1 });
  };

  onChangeSearch = e => {
    this.setState({
      keyword_search: e.target.value
    });
    // If the search bar is deleted to empty, search all artworks automatically
    if (e.target.value.trim() === '') {
      let newParams = new URLSearchParams(this.state.apiParams);
      newParams.delete('search');
      this.setState({ apiParams: newParams, currentPage: 1 });
    }
  };

  search = e => {
    e.preventDefault();
    let newParams = new URLSearchParams(this.state.apiParams);
    newParams.delete('search');
    if (this.state.keyword_search.trim() !== '') {
      newParams.append('search', this.state.keyword_search);
    }
    this.setState({ apiParams: newParams, currentPage: 1 });
  };

  showOverlay = artwork => {
    this.setState({
      overlay_visible: true,
      artwork
    });
  };

  hideOverlay = () => {
    this.setState({ overlay_visible: false });
  };

  async sendTransaction(artwork) {
    let body = {
      sender_email: window.localStorage.getItem('loggedInEmail'),
      receiver_email: artwork.artistEmail,
      type: artwork.isForDownload ? "Download" : (artwork.isForRental ? "Rental" : "Sale"),
      artwork: artwork._id,
    };
    await axios({
      method: 'post',
      url: 'http://localhost:3001/api/v1/transactions/transaction',
      data: body,
      headers: { 
        'Content-Type': 'application/json',
        'authorization': 'Bearer ' + window.localStorage.getItem('token'),
      }
    });
    this.hideOverlay();
  };

  render() {
    const {
      totalArtworks,
      currentArtworks,
      overlay_visible,
      artwork
    } = this.state;

    return (
      <div className="m-5">
        <div className="gallery-searchbar">
          <h4 className="filterBy-label mr-2">Filter by</h4>
          <Dropdown
            placeholder="Price"
            selection
            options={priceRanges}
            onChange={this.handlePriceChange}
            className="mr-2"
          />
          <Dropdown
            placeholder="Medium"
            selection
            options={mediums}
            onChange={this.handleMediumChange}
            className="mr-3"
          />
          <h4 className="sortBy-label mr-2">Sort by</h4>
          <Dropdown
            placeholder="Sort"
            selection
            options={sortOptions}
            onChange={this.handleSortChange}
            className="mr-5"
          />

          <Form inline className="searchForm ml-4">
            <FormControl
              type="text"
              placeholder="Search keyword"
              className="mr-sm-2"
              onChange={this.onChangeSearch}
            />
            <Button variant="outline-info" onClick={e => this.search(e)}>
              <FaSearch className="searchIcon" />
            </Button>
          </Form>
        </div>
        <div>
          <Modal
            visible={overlay_visible}
            title={artwork.title}
            onOk={() => {}}
            onCancel={this.hideOverlay}
            footer={[
              <Button
                variant="success"
                onClick={() => this.sendTransaction(artwork)}
                key={artwork._id}
              >
                Request {artwork.isForDownload ? "Download" : (artwork.isForRental ? "Rental" : "Sale")}
              </Button>,
            ]}
            width={'65vw'}
          >
            <Image src="holder.js/100px250" 
              fluid
              src={`http://localhost:3001/api/v1/arts/getFilepathByTitleArtist?artist=${artwork.artist}&title=${artwork.title}&imageSize=-large`}
              alt="Not Found"
            />
            
            <Descriptions bordered style={{ marginTop: '20px' }}>
              <Descriptions.Item label="Availability" span={2}>
                {artwork.isForDownload ? "Download" : (artwork.isForRental ? "Rental" : "Sale")}
              </Descriptions.Item>
              <Descriptions.Item label="Price">
                $ {artwork.price}
              </Descriptions.Item>
              <Descriptions.Item label="Artist">
                <a href={`/profile?email=${artwork.artistEmail}`}>
                  {artwork.artist}
                </a>
              </Descriptions.Item>
              <Descriptions.Item label="Artist Email">
                {artwork.artistEmail}
              </Descriptions.Item>
              <Descriptions.Item label="Upload Date">
                {artwork.creationTime === undefined ? '' : artwork.creationTime.substring(0, 10)}
              </Descriptions.Item>
              <Descriptions.Item label="Medium">
                <Tag color={this.addColorTag(artwork.medium)}>
                  {artwork.medium}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Width">
                {artwork.width}
              </Descriptions.Item>
              <Descriptions.Item label="Height">
                {artwork.height}
              </Descriptions.Item>
              <Descriptions.Item label="Description" span={3}>
                {artwork.description}
              </Descriptions.Item>
            </Descriptions>
          </Modal>
        </div>
        <div className="d-flex flex-row py-4 align-items-center">
          <Pagination
            totalRecords={totalArtworks}
            pageLimit={PAGE_LIMIT}
            pageNeighbours={PAGE_NEIGHBORS}
            onPageChanged={this.onPageChanged}
          />
        </div>
        <div>
          {currentArtworks.map((artwork, index) => (
            <Card style={{ width: '25vw' }} key={index} className="artwork m-4">
              <Card.Img
                variant="top"
                src={`http://localhost:3001/api/v1/arts/getFilepathByTitleArtist?artist=${artwork.artist}&title=${artwork.title}&imageSize=-small`}
                alt="Not Found"
                style={{ height: '250px' }}
              />
              <Card.Body>
                <Card.Title>
                  {artwork.title}{' '}
                  <Tag color={this.addColorTag(artwork.medium)}>
                    {artwork.medium}
                  </Tag>
                </Card.Title>
                <Card.Text>
                  <a href={`/profile?email=${artwork.artistEmail}`}>
                    By {artwork.artist}
                  </a>
                  <div>
                    {artwork.isForDownload ? (
                    <Tag
                      icon={<DownloadOutlined />}
                      color={'success'}
                    >
                      {' '}
                      Download
                    </Tag>) : null }
                    {artwork.isForSale ? (
                    <Tag
                      icon={<ShoppingCartOutlined />}
                      color={'success'}
                    >
                      {' '}
                      Sale
                    </Tag>) : null }
                    {artwork.isForRental ? (
                    <Tag
                      icon={<FolderOpenOutlined />}
                      color={'success'}
                    >
                      Rental
                    </Tag>) : null }
                  </div>
                </Card.Text>
                <Button
                  variant="primary"
                  onClick={() => this.showOverlay(artwork)}
                >
                  $ {artwork.price}
                </Button>
                {artwork.accessList.includes(window.localStorage.getItem('loggedInEmail')) && artwork.isForDownload ? (
                <Button
                  variant="danger"
                  href={`http://localhost:3001/api/v1/arts/getFilepathByTitleArtist?artist=${artwork.artist}&title=${artwork.title}&imageSize=`}
                >
                  Download
                </Button>) : null}
              </Card.Body>
            </Card>
          ))}
        </div>
      </div>
    );
  }
}
