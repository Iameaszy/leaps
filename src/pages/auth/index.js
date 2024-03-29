import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect, withRouter } from 'react-router-dom';
import { Carousel } from 'react-responsive-carousel';
import Button from './components/button';
import Loader from '../../assets/images/Spinner-1s-200px.svg';
import authActionTypes from '../../redux/auth/auth.actionTypes';
import { login, signup, sendResetPassword } from '../../redux/auth/auth.action';
import { validator } from '../../helpers/utils';
import Dialog from '../../components/dialog';
import authImage1 from '../../assets/images/auth-image-1.jpeg';
import authImage2 from '../../assets/images/auth-image-2.jpg';
import authImage3 from '../../assets/images/auth-image-3.jpg';

import 'react-responsive-carousel/lib/styles/carousel.min.css';
import './style.scss';

const countries = ['Nigeria', 'Ethiopia', 'Kenya', 'Malawi', 'United Kingdom'];
function printError(type, error) {
  switch (type) {
    case authActionTypes.LOGIN_FAILED:
    case authActionTypes.SIGNUP_FAILED:
    case authActionTypes.SEND_RESET_PASSWORD_FAILED:
      return <Dialog title={type} message={error} />;
    case authActionTypes.LOGIN_SUCCESS:
      return <Dialog title={type} message="Success!" />;
    default:
      return null;
  }
}
export class Auth extends Component {
  constructor(props) {
    super(props);
    this.state = {
      signin: {
        email: { value: '', valid: false },
        password: { value: '', valid: false },
      },
      signup: {
        email: { value: '', valid: false },
        password: { value: '', valid: false },
        confirm_password: { value: '', valid: false },
        country: { value: 'Kenya', valid: true },
        name: { value: '', valid: false },
      },
      forgot: { email: { value: '', valid: false } },
      signinToSubmit: {},
      signupToSubmit: {
        country: 'Kenya',
      },
      forgotPasswordToSubmit: {},
      activePage: 'signin',
      showSigninInvalid: false,
      showSignupInvalid: false,
      showForgotPasswordInvalid: false,
    };
    this.handleSigninInputChange = this.handleSigninInputChange.bind(this);
    this.handleSignupInputChange = this.handleSignupInputChange.bind(this);
    this.handleForgotPasswordInputChange = this.handleForgotPasswordInputChange.bind(
      this,
    );
    this.handleForgotPasswordInputChange.bind(this);
    this.onSigninSubmit = this.onSigninSubmit.bind(this);
    this.onSignupSubmit = this.onSignupSubmit.bind(this);
    this.onForgotPasswordSubmit = this.onForgotPasswordSubmit.bind(this);
    this.formIsValid = this.formIsValid.bind(this);
  }

  formIsValid() {
    const { activePage } = this.state;
    const form = this.state[activePage];
    const formKeys = Object.keys(form);
    const validCount = formKeys.filter(k => form[k].valid === true).length;
    if (activePage === 'signup') {
      return (
        validCount === formKeys.length
        && form.password.value === form.confirm_password.value
      );
    }
    return validCount === formKeys.length;
  }

  onSigninSubmit(e) {
    e.preventDefault();
    this.setState({ showSigninInvalid: false });
    if (!this.formIsValid()) {
      this.setState({ showSigninInvalid: true });
      return;
    }
    const { signinToSubmit } = this.state;
    const { signin } = this.props;
    signin(signinToSubmit);
  }

  onSignupSubmit(e) {
    e.preventDefault();
    this.setState({ showSignupInvalid: false });
    if (!this.formIsValid()) {
      this.setState({ showSignupInvalid: true });
      return;
    }
    const { signupToSubmit } = this.state;
    const { signup: register } = this.props;
    register(signupToSubmit);
  }

  onForgotPasswordSubmit(e) {
    e.preventDefault();
    this.setState({ showForgotPasswordInvalid: false });
    if (!this.formIsValid()) {
      this.setState({ showForgotPasswordInvalid: true });
      return;
    }
    const { forgotPasswordToSubmit } = this.state;
    const { resetPassword } = this.props;
    resetPassword(forgotPasswordToSubmit);
  }

  componentDidMount() {
    const path = this.props.match.path.replace('/', '');
    let { activePage } = this.state;
    if (path === 'signin' || path === 'login') {
      activePage = 'signin';
    }
    if (path === 'signup' || path === 'forgot') {
      activePage = path;
    }
    this.setState({ activePage });
  }

  handleSigninInputChange(e) {
    const { name, value, type } = e.target;
    this.setState(p => ({
      signinToSubmit: { ...p.signinToSubmit, [name]: value },
      signin: {
        ...p.signin,
        [name]: {
          value,
          valid: validator(value, type),
        },
      },
    }));
  }

  handleSignupInputChange(e) {
    const { name, value, type } = e.target;
    this.setState(p => ({
      signupToSubmit: { ...p.signupToSubmit, [name]: value },
      signup: {
        ...p.signup,
        [name]: {
          value,
          valid: validator(value, type),
        },
      },
    }));
  }

  handleForgotPasswordInputChange(e) {
    const { name, value, type } = e.target;
    this.setState(p => ({
      forgotPasswordToSubmit: { ...p.forgotPasswordToSubmit, [name]: value },
      forgot: {
        ...p.forgot,
        [name]: {
          value,
          valid: validator(value, type),
        },
      },
    }));
  }

  render() {
    const {
      signin,
      signup,
      forgot,
      showSigninInvalid,
      showSignupInvalid,
      showForgotPasswordInvalid,
    } = this.state;

    const { type, error, data } = this.props;
    if (
      (type === authActionTypes.LOGIN_SUCCESS
        || type === authActionTypes.CHECK_AUTH_SUCCESS
        || type === authActionTypes.SIGNUP_SUCCESS)
      && data.isAdmin
    ) {
      return <Redirect to="/admin" />;
    }
    if (
      (type === authActionTypes.LOGIN_SUCCESS
        || type === authActionTypes.CHECK_AUTH_SUCCESS
        || type === authActionTypes.SIGNUP_SUCCESS)
      && !data.isAdmin
    ) {
      return <Redirect to="/" />;
    }

    const { activePage } = this.state;
    return (
      <section className="Login2 container-fluid">
        <div className="row">
          <div className="col-md-7 col-12 left-column">
            <Carousel
              showArrows={false}
              showThumbs={false}
              showStatus={false}
              showIndicators={false}
              interval={5000}
              transitionTime={500}
              infiniteLoop
              autoPlay
            >
              <div>
                <img className="img" src={authImage1} alt="" />
                <div className="hero">
                  <h3 className="brand">leaps</h3>

                  <div className="hero-text">
                    <h3 className="hero-text__text">
                      Verify authenticity of contents
                    </h3>
                  </div>
                </div>
              </div>
              <div>
                <img className="img" src={authImage2} alt="" />
                <div className="hero">
                  <h3>leaps</h3>

                  <div className="hero-text">
                    <h3 className="hero-text__text">
                      Provide contents by collaboration
                    </h3>
                  </div>
                </div>
              </div>
              <div>
                <img className="img" src={authImage3} alt="" />
                <div className="hero">
                  <h3>leaps</h3>

                  <div className="hero-text">
                    <h3 className="hero-text__text">
                      Publish content anywhere at anytime
                    </h3>
                  </div>
                </div>
              </div>
            </Carousel>
          </div>
          <div className="col-md-5 col-12 content-container">
            <div className="row">
              <div className="col-12">
                <div className="title">
                  {activePage === 'signin' && <h1>Sign in to your account</h1>}
                  {activePage === 'signup' && <h1>Create new account</h1>}
                  {activePage === 'forgot' && <h1>Reset your password</h1>}
                </div>
                <div className="tab-control">
                  <button
                    type="button"
                    onClick={(e) => {
                      this.setState({
                        showSigninInvalid: false,
                        showSignupInvalid: false,
                        showForgotPasswordInvalid: false,
                        activePage: 'signin',
                      });
                    }}
                    className={`btn signin ${
                      activePage === 'signin' ? 'show' : ''
                    }`}
                  >
                    Sign in
                  </button>
                  <button
                    onClick={(e) => {
                      this.setState({
                        activePage: 'signup',
                        showSigninInvalid: false,
                        showSignupInvalid: false,
                        showForgotPasswordInvalid: false,
                      });
                    }}
                    type="button"
                    className={`btn signup ${
                      activePage === 'signup' ? 'show' : ''
                    }`}
                  >
                    Sign up
                  </button>
                  <button
                    onClick={(e) => {
                      this.setState({
                        showSigninInvalid: false,
                        showSignupInvalid: false,
                        showForgotPasswordInvalid: false,
                        activePage: 'forgot',
                      });
                    }}
                    type="button"
                    className={`btn forgot ${
                      activePage === 'forgot' ? 'show' : ''
                    }`}
                  >
                    Forgot
                  </button>
                </div>
              </div>
            </div>
            <form
              className={`row tab-content signin-content ${
                activePage === 'signin' ? 'show' : ''
              }`}
              onSubmit={this.onSigninSubmit}
            >
              <div className="caret" />
              <div className="form-group col-12">
                <input
                  type="text"
                  className="form-control"
                  name="email"
                  placeholder="Email"
                  value={signin.email.value}
                  onChange={this.handleSigninInputChange}
                />
                {showSigninInvalid && !signup.name.valid && (
                  <p className="input-error-text">
                    Email field cannot be empty
                  </p>
                )}
              </div>
              <div className="form-group col-12">
                <input
                  type="password"
                  className="form-control"
                  name="password"
                  placeholder="Password"
                  value={signin.password.value}
                  onChange={this.handleSigninInputChange}
                />
                {showSigninInvalid && !signup.password.valid && (
                  <p className="input-error-text">
                    Password field cannot be empty
                  </p>
                )}
              </div>
              <div className="form-group col-12">
                <Button className="btn submit-btn" type="submit">
                  {type === authActionTypes.LOGIN_LOADING ? (
                    <span className="preloader-wrapper">
                      <img
                        src={Loader}
                        alt="preloader"
                        className="preloader"
                        width="35px"
                      />
                    </span>
                  ) : (
                    <span className="login-text">Sign in</span>
                  )}
                </Button>
                {(type === authActionTypes.LOGIN_FAILED
                  || type === authActionTypes.LOGIN_SUCCESS)
                  && printError(type, error)}
              </div>
            </form>
            <form
              className={`row tab-content signup-content ${
                activePage === 'signup' ? 'show' : ''
              }`}
              onSubmit={this.onSignupSubmit}
            >
              <div className="caret" />
              <div className="form-group col-12">
                <input
                  type="text"
                  onChange={this.handleSignupInputChange}
                  value={signup.name.value}
                  className="form-control"
                  name="name"
                  placeholder="Fullname"
                />
                {showSignupInvalid && !signup.name.valid && (
                  <p className="input-error-text">Name field cannot be empty</p>
                )}
              </div>
              <div className="form-group col-12">
                <input
                  type="email"
                  onChange={this.handleSignupInputChange}
                  value={signup.email.value}
                  className="form-control"
                  name="email"
                  placeholder="Email"
                />
                {showSignupInvalid && !signup.email.valid && (
                  <p className="input-error-text">
                    Email field cannot be empty
                  </p>
                )}
              </div>
              <div className="form-group col-12">
                <input
                  onChange={this.handleSignupInputChange}
                  value={signup.password.value}
                  type="password"
                  className="form-control"
                  name="password"
                  placeholder="Password"
                />
                {showSignupInvalid && !signup.password.valid && (
                  <p className="input-error-text">
                    Password field cannot be empty
                  </p>
                )}
              </div>
              <div className="form-group col-12">
                <input
                  type="password"
                  className="form-control"
                  name="confirm_password"
                  placeholder="Enter password again"
                  value={signup.confirm_password.value}
                  onChange={this.handleSignupInputChange}
                />
                {showSignupInvalid && !signup.confirm_password.value && (
                  <p className="input-error-text">
                    Reset password field cannot be empty
                  </p>
                )}
                {showSignupInvalid
                  && signup.password.value
                  && signup.confirm_password.value
                  && signup.password.value !== signup.confirm_password.value && (
                    <p className="input-error-text">Password do not match</p>
                )}
              </div>
              <div className="form-group col-12">
                <select
                  name="country"
                  id="country"
                  onChange={this.handleSignupInputChange}
                  value={signup.country.value}
                  className="form-control"
                  aria-describedby="countryId"
                >
                  {countries.map((country, ind) => (
                    <option value={country} key={ind}>
                      {country}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group col-12">
                <Button className="btn submit-btn" type="submit">
                  {type === authActionTypes.SIGNUP_LOADING ? (
                    <span className="preloader-wrapper">
                      <img
                        src={Loader}
                        alt="preloader"
                        className="preloader"
                        width="35px"
                      />
                    </span>
                  ) : (
                    <span className="login-text">Sign up</span>
                  )}
                </Button>
                {(type === authActionTypes.SIGNUP_FAILED
                  || type === authActionTypes.SIGNUP_SUCCESS)
                  && printError(type, error)}
              </div>
            </form>
            <form
              className={`row tab-content forgot-content ${
                activePage === 'forgot' ? 'show' : ''
              }`}
              onSubmit={this.onForgotPasswordSubmit}
            >
              <div className="caret" />
              <div className="form-group col-12">
                <input
                  type="text"
                  className="form-control"
                  name="email"
                  placeholder="Email"
                  onChange={this.handleForgotPasswordInputChange}
                  value={forgot.email.value}
                />
                {showForgotPasswordInvalid && !forgot.email.valid && (
                  <p className="input-error-text">
                    Email field cannot be empty
                  </p>
                )}
              </div>
              <div className="form-group col-12">
                <Button className="btn submit-btn" type="submit">
                  {type === authActionTypes.SEND_RESET_PASSWORD_LOADING ? (
                    <span className="preloader-wrapper">
                      <img
                        src={Loader}
                        alt="preloader"
                        className="preloader"
                        width="35px"
                      />
                    </span>
                  ) : (
                    <span className="login-text">Forgot password</span>
                  )}
                </Button>
                {type === authActionTypes.SEND_RESET_PASSWORD_FAILED
                  && printError(type, error)}
                {type === authActionTypes.SEND_RESET_PASSWORD_SUCCESS && (
                  <Dialog
                    title="Forgot Password"
                    message="Password reset sent, please check your email!"
                    name="reset password"
                    clicked={() => {
                      this.setState({
                        showSigninInvalid: false,
                        showSignupInvalid: false,
                        showForgotPasswordInvalid: false,
                        activePage: 'signin',
                      });
                    }}
                  />
                )}
              </div>
            </form>
          </div>
        </div>
      </section>
    );
  }
}

const mapStateToProps = state => ({
  type: state.auth.type,
  error: state.auth.error,
  data: state.auth.data,
});
const mapDispatchToProps = dispatch => ({
  signin: obj => dispatch(login(obj)),
  signup: obj => dispatch(signup(obj)),
  resetPassword: obj => dispatch(sendResetPassword(obj)),
});

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Auth));
