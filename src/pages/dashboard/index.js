import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  FiPlus, FiCheck, FiEdit, FiEdit2, FiEdit3,
} from 'react-icons/fi';
import Loader from 'react-loader-spinner';
import { isURL } from 'validator';
import { validator } from '../../helpers/utils';
import * as storage from '../../helpers/token';
import { uploadResources } from '../../redux/dash/dash.action';
import dashActionTypes from '../../redux/dash/dash.actionTypes';
import './index.scss';

export class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      form: {
        subject: { value: 'Health Education', valid: true },
        topic: { value: '', valid: false },
        heading: { value: '', valid: false },
        excerpt: { value: '', valid: false },
        definition: { value: '', valid: false },
        pdf: { value: '', files: [], valid: false },
        image: { value: '', files: [], valid: false },
        video: { value: '', files: [], valid: false },
      },
      toSubmit: {},
      activeContent: 'texts',
      temporaryFiles: [],
      documents: {
        subject: '',
        topic: '',
        texts: [],
        pdf: [],
        image: [],
        video: [],
        tags: [],
      },
      showedResources: 'texts',
    };
    this.handleInputChange = this.handleInputChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.handleResourceBtnClick = this.handleResourceBtnClick.bind(this);
    this.AddMore = this.AddMore.bind(this);
    this.setTags = this.setTags.bind(this);
    this.pdfFile = React.createRef();
    this.imageFile = React.createRef();
    this.videoFile = React.createRef();
    this.deleteTag = this.deleteTag.bind(this);
    this.onDocumentLoadSuccess = this.onDocumentLoadSuccess.bind(this);
  }
  onDocumentLoadSuccess = ({ numPages }) => {
    this.setState({ numPages });
  };
  handleInputChange(e) {
    const {
      name, value, type, files,
    } = e.target;
    const docFiles = files ? Array.from(files) : [];

    if (type === 'file') {
      let filename = 'image';
      if (name === 'videoFile') filename = 'video';
      else if (name === 'imageFile') filename = 'image';
      else filename = 'pdf';

      this.setState(p => ({
        toSubmit: { ...p.toSubmit, [name]: value },
        form: {
          ...p.form,
          [filename]: {
            value: '',
            files: docFiles,
            valid: docFiles.length > 0,
          },
        },
      }));
    } else {
      this.setState(p => ({
        toSubmit: { ...p.toSubmit, [name]: value },
        form: {
          ...p.form,
          [name]: {
            value,
            valid: validator(value, type, name),
            files: [],
          },
        },
      }));
    }
  }

  deleteTag(index) {
    const { documents } = this.state;
    const { tags } = documents;
    tags.splice(index, 1);
    documents.tags = tags;
    this.setState({ documents });
  }

  setTags(ev, check = false) {
    const { form, documents } = this.state;
    const { value: topic } = form.topic;
    let { tags } = documents;
    if (check && tags.length < 10) {
      tags = topic.split(' ').filter((tag) => {
        if (tag.length > 2) {
          return tag;
        }
        return false;
      });
      documents.tags = tags;
      this.setState({ documents });
    } else if (ev.which === 32 && tags.length < 10) {
      tags = topic.split(' ').filter((tag) => {
        if (tag.length > 2) {
          return tag;
        }
        return false;
      });
      documents.tags = tags;
      this.setState({ documents });
    }
  }

  AddMore(name, isText = false) {
    const { documents, form } = this.state;
    let showedResources;
    if (isText) {
      const doc = {};
      doc.heading = form.heading.value;
      doc.excerpt = form.excerpt.value;
      doc.definition = form.definition.value;
      documents.texts.push(doc);
      showedResources = 'texts';
      form.heading.value = '';
      form.heading.valid = false;
      form.excerpt.value = '';
      form.excerpt.valid = false;
      form.definition.value = '';
      form.definition.valid = false;
    } else {
      documents[name].push(
        form[name].value ? form[name].value : form[name].files,
      );
      showedResources = name;
      form[name].value = '';
      form[name].valid = false;
      form[name].files = [];
    }
    documents.subject = form.subject;
    documents.topic = form.topic;
    this.setState({
      documents,
      showedResources,
      form,
    });
  }

  onSubmit(ev) {
    ev.preventDefault();
    const { form, documents } = this.state;
    const { uploadResources: upload } = this.props;
    const user = storage.getToken();

    documents.user_name = user.name;
    documents.user_email = user.email;
    documents.user_id = user.uid;
    documents.user_country = user.country;
    documents.subject = form.subject.value;
    documents.topic = form.topic.value;
    documents.texts.push({
      heading: form.heading.value,
      excerpt: form.excerpt.value,
      definition: form.definition.value,
    });
    documents.pdf.push(form.pdf.value ? form.pdf.value : form.pdf.files);
    documents.image.push(
      form.image.value ? form.image.value : form.image.files,
    );
    documents.video.push(
      form.video.value ? form.video.value : form.video.files,
    );
    upload(documents);
  }

  componentDidUpdate(prevProps, prevStates) {
    if (prevStates.activeContent !== this.state.activeContent) {
      this.setState({ temporaryFiles: [] });
    }
    console.log(this.state);
  }

  handleResourceBtnClick(type) {
    let activeContent = 'texts';
    switch (type) {
      case 'image':
        activeContent = 'image';
        break;
      case 'video':
        activeContent = 'video';
        break;
      case 'text':
        activeContent = 'texts';
        break;
      default:
        activeContent = 'pdf';
    }
    this.setState({ activeContent });
  }

  render() {
    const {
      form, activeContent, documents, moreAdded
    } = this.state;
    // const { type, error } = this.props;
    // const formKeys = Object.keys(form);
    // const validCount = formKeys.filter(k => form[k].valid === true).length;
    // const allFieldsAreValid = validCount === formKeys.length;
    const { dash } = this.props;
    const textFieldIsValid = !!(
      form.heading.value
      && form.excerpt.value
      && form.definition.value
      && form.topic.value
    );
    const pdfIsValid = (isURL(form.pdf.value) && form.topic.valid) || form.pdf.files.length > 0;
    const imageIsValid = (isURL(form.image.value) && form.topic.valid)
      || form.image.files.length > 0;
    const videoIsValid = (isURL(form.video.value) && form.topic.valid)
      || form.video.files.length > 0;

    return (
      <div className="container-fluid Dashboard">
        <div className="row">
          <form
            onSubmit={this.onSubmit}
            className="content offset-0 offset-md-2 col-md-8 col-12 form"
          >
            <div className="row">
              <div className="form-group col-12 col-md-6 subject-topic-row">
                <select
                  value={form.subject.value}
                  onChange={this.handleInputChange}
                  className="form-control"
                  name="subject"
                  id="subject"
                >
                  <option value="health education">Health Education</option>
                  <option value="civic studies">Civic Studies</option>
                  <option value="integrated science">Integrated Science</option>
                </select>
              </div>
              <div className="form-group col-md-6 col-12">
                <label htmlFor="topic" />
                <input
                  type="text"
                  className="form-control"
                  name="topic"
                  id="topic"
                  placeholder="Topic"
                  value={form.topic.value}
                  onChange={this.handleInputChange}
                  onKeyPress={this.setTags}
                  autoComplete="true"
                  onBlur={(e) => {
                    this.setTags(e, true);
                  }}
                />
              </div>
            </div>
            {documents.tags.length > 0 && (
              <div className="row tags-row">
                <div className="offset-0 col-12 selected-tags-wrapper">
                  <h3 className="selected-tags">Tags selected for you</h3>
                </div>
                <div className="col-12 tags-wrapper">
                  {documents.tags.map((tag, index) => (
                    <span className="tag" key={index}>
                      <span
                        onClick={e => this.deleteTag(index)}
                        title="delete"
                        className="delete-tag"
                      >
                        x
                      </span>
                      <span className="tag-text">{tag}</span>
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="row d-flex justify-content-center upload-resources-heading-row">
              <div className="offset-0 offset-md-3 col-12 col-md-9">
                <h3 className="upload-text">Upload Resource content!</h3>
              </div>
            </div>
            {
              <div className="row resources-row">
              {documents[activeContent].filter((resource, index) => resource).map((resource, index) => {
                if (activeContent === 'texts') {
                  return (
                    <div key={index} className="text-resource resource-card">
                      <div className="card-title">
                        <h3>{resource.heading}</h3>
                      </div>
                      <div className="card-body">
                        <p className="p">
                          {resource.definition}
                        </p>
                      </div>
                    </div>
                  );
                }
                if (activeContent === 'video') {
                  if (typeof resource === 'string') {
                    return (
                      <div className="video-resource" key={index}>
                        <iframe
                          width="100%"
                          height="auto"
                          className="iframe"
                          src={resource}
                        />
                      </div>
                    );
                  }
                }
                if (activeContent === 'image') {
                  if (typeof resource === 'string') {
                    return (
                      <div className="image-resource" key={index}>
                        <img src={resource} alt="" width="100%" height="autp" />
                      </div>
                    );
                  }
                }
                if (activeContent === 'pdf') {
                  if (typeof resource === 'string') {
                    return (
                      <div className="pdf-resource" key={index}>
                        <iframe src={`http://docs.google.com/gview?url=${resource}&embedded=true`} style={{width:'100%'}} frameBorder="0"></iframe>

                      </div>
                    );
                  }
                }
              })}
            </div>
            }

            <div className="row resources-btn-row">
              <div className="col-md-10 col-12 offset-0 d-flex btn-wrapper offset-md-1">
                <button
                  type="button"
                  className={`text-btn btn ${
                    activeContent === 'texts' ? 'active' : ''
                  }`}
                  onClick={() => this.handleResourceBtnClick('text')}
                >
                  {activeContent === 'texts' ? (
                    <FiCheck className="check" />
                  ) : (
                    ''
                  )}
                  Texts
                </button>
                <button
                  type="button"
                  className={`pdf-btn btn ${
                    activeContent === 'pdf' ? 'active' : ''
                  }`}
                  onClick={() => this.handleResourceBtnClick('pdf')}
                >
                  {activeContent === 'pdf' ? <FiCheck className="check" /> : ''}
                  Pdfs
                </button>
                <button
                  type="button"
                  className={`image-btn btn ${
                    activeContent === 'image' ? 'active' : ''
                  }`}
                  onClick={() => this.handleResourceBtnClick('image')}
                >
                  {activeContent === 'image' ? (
                    <FiCheck className="check" />
                  ) : (
                    ''
                  )}
                  Images
                </button>
                <button
                  type="button"
                  className={`video-btn btn ${
                    activeContent === 'video' ? 'active' : ''
                  }`}
                  onClick={() => this.handleResourceBtnClick('video')}
                >
                  {activeContent === 'video' ? (
                    <FiCheck className="check" />
                  ) : (
                    ''
                  )}
                  Videos
                </button>
              </div>
            </div>
            <div className="row content-row">
              <div
                className={`offset-md-1 offset-0 col-md-11 col-12 text-content content ${
                  activeContent === 'texts' ? 'show' : ''
                }`}
              >
                <div className="text-content-form-group form-group col-md-11 col-12">
                  <FiEdit className="edit-icon" />
                  <input
                    type="text"
                    value={form.heading.value}
                    onChange={this.handleInputChange}
                    placeholder="Heading"
                    name="heading"
                    autoComplete="true"
                    className="form-control text-form-control"
                  />
                </div>
                <div className="text-content-form-group form-group col-md-11 col-12">
                  <FiEdit2 className="edit-icon" />
                  <textarea
                    className="form-control text-form-control"
                    name="excerpt"
                    id="excerpt"
                    rows={3}
                    onChange={this.handleInputChange}
                    placeholder="Excerpt"
                    value={form.excerpt.value}
                  />
                </div>
                <div className="form-group text-content-form-group  col-md-11 col-12">
                  <FiEdit3 className="edit-icon" />
                  <textarea
                    className="form-control text-form-control"
                    name="definition"
                    id="definition"
                    rows="5"
                    onChange={this.handleInputChange}
                    placeholder="Definition"
                    value={form.definition.value}
                  />
                </div>
                <div className="form-group col-md-10 col-12 form-group-btn">
                  <button
                    type="button"
                    disabled={
                      !(
                        form.heading.valid
                        && form.excerpt.valid
                        && form.definition.valid
                      )
                    }
                    className="add-text-btn btn"
                    onClick={() => this.AddMore('', true)}
                  >
                    Add more
                  </button>
                </div>
              </div>
              <div
                className={`offset-1 col-10 pdf-content content ${
                  activeContent === 'pdf' ? 'show' : ''
                }`}
              >
                <div className="row">
                  <div className="form-group input-wrapper col-md-11 col-10">
                    <input
                      type="text"
                      id="proxy"
                      className="form-control"
                      name="pdf"
                      value={form.pdf.value}
                      autoComplete="true"
                      onChange={this.handleInputChange}
                      placeholder="http://"
                    />
                    <div
                      className="icon-helper"
                      title="Attach a file"
                      onClick={() => {
                        this.pdfFile.current.click();
                      }}
                    >
                      <FiPlus size={30} className="add-icon" />
                    </div>
                    <ul className="list pdf-list">
                      {form.pdf.files.map((file, index) => (
                        <li key={index} className="list-item pdf-list-item">
                          {file.name}
                        </li>
                      ))}
                    </ul>
                    <input
                      ref={this.pdfFile}
                      type="file"
                      name="pdfFile"
                      className="file"
                      onChange={this.handleInputChange}
                      value=""
                      multiple
                      accept="application/pdf,.doc"
                    />
                  </div>
                </div>
                <div className="form-group col-10 form-group-btn btn-wrapper">
                  <button
                    type="button"
                    disabled={!form.pdf.valid}
                    onClick={() => this.AddMore('pdf')}
                    className="add-pdf-btn btn"
                  >
                    Add more
                  </button>
                </div>
              </div>
              <div
                className={`offset-1 col-10 image-content content ${
                  activeContent === 'image' ? 'show' : ''
                }`}
              >
                <div className="row">
                  <div className="form-group input-wrapper col-md-11 col-10">
                    <input
                      type="text"
                      id="proxy"
                      className="form-control"
                      name="image"
                      value={form.image.value}
                      onChange={this.handleInputChange}
                      placeholder="http://"
                      autoComplete="true"
                    />
                    <div
                      className="icon-helper"
                      title="Attach a file"
                      onClick={() => {
                        this.imageFile.current.click();
                      }}
                    >
                      <FiPlus size={30} className="add-icon" />
                    </div>
                    <ul className="list pdf-list">
                      {form.image.files.map((file, index) => (
                        <li key={index} className="list-item pdf-list-item">
                          {file.name}
                        </li>
                      ))}
                    </ul>
                    <input
                      ref={this.imageFile}
                      type="file"
                      name="imageFile"
                      className="file"
                      onChange={this.handleInputChange}
                      multiple
                      value=""
                      accept="image/*"
                    />
                  </div>
                </div>
                <div className="form-group col-10 form-group-btn btn-wrapper">
                  <button
                    type="button"
                    disabled={!form.image.valid}
                    onClick={() => this.AddMore('image')}
                    className="add-image-btn btn"
                  >
                    Add more
                  </button>
                </div>
              </div>
              <div
                className={`offset-1 col-10 video-content content ${
                  activeContent === 'video' ? 'show' : ''
                }`}
              >
                <div className="row">
                  <div className="form-group input-wrapper col-md-11 col-10">
                    <input
                      type="text"
                      placeholder="http://"
                      id="proxy"
                      className="form-control"
                      name="video"
                      value={form.video.value}
                      onChange={this.handleInputChange}
                      autoComplete="true"
                    />
                    <div
                      className="icon-helper"
                      title="Attach a file"
                      onClick={() => {
                        this.videoFile.current.click();
                      }}
                    >
                      <FiPlus size={30} className="add-icon" />
                    </div>
                    <ul className="list pdf-list">
                      {form.video.files.map((file, index) => (
                        <li key={index} className="list-item pdf-list-item">
                          {file.name}
                        </li>
                      ))}
                    </ul>
                    <input
                      ref={this.videoFile}
                      type="file"
                      name="videoFile"
                      className="file"
                      onChange={this.handleInputChange}
                      value=""
                      multiple
                      accept="video/mp4,video/x-m4v,video/*"
                    />
                  </div>
                </div>
                <div className="form-group col-10 form-group-btn btn-wrapper">
                  <button
                    type="button"
                    disabled={!form.video.valid}
                    onClick={() => this.AddMore('video')}
                    className="add-video-btn btn"
                  >
                    Add more
                  </button>
                </div>
              </div>
            </div>
            <div className="row upload-btn-row">
              <div className="form-group col-8 offset-3 btn-wrapper">
                {dash.type === dashActionTypes.UPLOAD_RESOURCES_LOADING ? (
                  <button type="submit" className="btn upload-btn">
                    <Loader
                      type="Circles"
                      color="#00BFFF"
                      height="20"
                      width="100"
                    />
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={
                      !textFieldIsValid
                      && !pdfIsValid
                      && !imageIsValid
                      && !videoIsValid
                    }
                    className="btn upload-btn"
                  >
                    Upload all
                  </button>
                )}
                {dash.type === dashActionTypes.UPLOAD_RESOURCES_SUCCESS && (
                  <p className="upload-success">Upload Successful!</p>
                )}
                {dash.type === dashActionTypes.UPLOAD_RESOURCES_FAILED && (
                  <p className="upload-error">{dash.error}</p>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

const mapStatesToProps = states => ({
  dash: states.dash,
});
const mapDispatchToProps = dispatch => ({
  uploadResources: document => dispatch(uploadResources(document)),
});
export default connect(
  mapStatesToProps,
  mapDispatchToProps,
)(Dashboard);
