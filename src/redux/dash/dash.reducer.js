import dashActionTypes from './dash.actionTypes';

const initialState = {
  type: '',
  data: null,
  error: '',
};
export default (state = initialState, payload) => {
  switch (payload.type) {
    case dashActionTypes.UPLOAD_RESOURCES_LOADING:
      return {
        ...state,
        type: dashActionTypes.UPLOAD_RESOURCES_LOADING,
      };

    case dashActionTypes.UPLOAD_RESOURCES_SUCCESS:
      return {
        ...state,
        type: dashActionTypes.UPLOAD_RESOURCES_SUCCESS,
        data: payload.data,
      };
    case dashActionTypes.UPLOAD_RESOURCES_FAILED:
      return {
        ...state,
        type: dashActionTypes.UPLOAD_RESOURCES_FAILED,
        error: payload.error,
      };

    case dashActionTypes.UPDATE_TEACHER_DETAILS_LOADING:
      return {
        ...state,
        type: dashActionTypes.UPDATE_TEACHER_DETAILS_LOADING,
      };
    case dashActionTypes.UPDATE_TEACHER_DETAILS_SUCCESS:
      return {
        ...state,
        type: dashActionTypes.UPDATE_TEACHER_DETAILS_SUCCESS,
      };

    case dashActionTypes.UPDATE_TEACHER_DETAILS_FAILED:
      return {
        ...state,
        type: dashActionTypes.UPDATE_TEACHER_DETAILS_FAILED,
        error: payload.error,
      };

    case dashActionTypes.UPDATE_RESEARCHER_DETAILS_LOADING:
      return {
        ...state,
        type: dashActionTypes.UPDATE_RESEARCHER_DETAILS_LOADING,
      };
    case dashActionTypes.UPDATE_RESEARCHER_DETAILS_SUCCESS:
      return {
        ...state,
        type: dashActionTypes.UPDATE_RESEARCHER_DETAILS_SUCCESS,
      };

    case dashActionTypes.UPDATE_RESEARCHER_DETAILS_FAILED:
      return {
        ...state,
        type: dashActionTypes.UPDATE_RESEARCHER_DETAILS_FAILED,
        error: payload.error,
      };

    case dashActionTypes.UPDATE_DETAILS_LOADING:
      return {
        ...state,
        type: dashActionTypes.UPDATE_DETAILS_LOADING,
      };
    case dashActionTypes.UPDATE_DETAILS_SUCCESS:
      return {
        ...state,
        type: dashActionTypes.UPDATE_DETAILS_SUCCESS,
        data: payload.data,
      };

    case dashActionTypes.UPDATE_DETAILS_FAILED:
      return {
        ...state,
        type: dashActionTypes.UPDATE_DETAILS_FAILED,
        error: payload.error,
      };

    case dashActionTypes.UPDATE_RESOURCES_LOADING:
      return {
        ...state,
        type: dashActionTypes.UPDATE_RESOURCES_LOADING,
      };
    case dashActionTypes.UPDATE_RESOURCES_SUCCESS:
      return {
        ...state,
        type: dashActionTypes.UPDATE_RESOURCES_SUCCESS,
      };

    case dashActionTypes.UPDATE_RESOURCES_FAILED:
      return {
        ...state,
        type: dashActionTypes.UPDATE_RESOURCES_FAILED,
        error: payload.error,
      };

    case dashActionTypes.FETCH_RESEARCHER_FAILED:
      return {
        ...state,
        type: dashActionTypes.FETCH_RESEARCHER_FAILED,
        error: payload.error,
      };

    case dashActionTypes.FETCH_RESEARCHER_LOADING:
      return {
        ...state,
        type: dashActionTypes.FETCH_RESEARCHER_LOADING,
      };
    case dashActionTypes.FETCH_RESEARCHER_SUCCESS:
      return {
        ...state,
        type: dashActionTypes.FETCH_RESEARCHER_SUCCESS,
        data: payload.data,
      };

    case dashActionTypes.FETCH_TEACHERS_FAILED:
      return {
        ...state,
        type: dashActionTypes.FETCH_TEACHERS_FAILED,
        error: payload.error,
      };

    case dashActionTypes.FETCH_TEACHERS_LOADING:
      return {
        ...state,
        type: dashActionTypes.FETCH_TEACHERS_LOADING,
      };
    case dashActionTypes.FETCH_TEACHERS_SUCCESS:
      return {
        ...state,
        type: dashActionTypes.FETCH_TEACHERS_SUCCESS,
        data: payload.data,
      };

    case dashActionTypes.FETCH_RESEARCHERS_FAILED:
      return {
        ...state,
        type: dashActionTypes.FETCH_RESEARCHERS_FAILED,
        error: payload.error,
      };

    case dashActionTypes.FETCH_RESEARCHERS_LOADING:
      return {
        ...state,
        type: dashActionTypes.FETCH_RESEARCHERS_LOADING,
      };
    case dashActionTypes.FETCH_RESEARCHERS_SUCCESS:
      return {
        ...state,
        type: dashActionTypes.FETCH_RESEARCHERS_SUCCESS,
        data: payload.data,
      };

    case dashActionTypes.FETCH_RESEARCHER_IMAGES_FAILED:
      return {
        ...state,
        type: dashActionTypes.FETCH_RESEARCHER_IMAGES_FAILED,
        error: payload.error,
      };

    case dashActionTypes.FETCH_RESEARCHER_IMAGES_LOADING:
      return {
        ...state,
        type: dashActionTypes.FETCH_RESEARCHER_IMAGES_LOADING,
      };
    case dashActionTypes.FETCH_RESEARCHER_IMAGES_SUCCESS:
      return {
        ...state,
        type: dashActionTypes.FETCH_RESEARCHER_IMAGES_SUCCESS,
        data: payload.data,
      };

    case dashActionTypes.FETCH_RESEARCHER_VIDEOS_FAILED:
      return {
        ...state,
        type: dashActionTypes.FETCH_RESEARCHER_VIDEOS_FAILED,
        error: payload.error,
      };

    case dashActionTypes.FETCH_RESEARCHER_VIDEOS_LOADING:
      return {
        ...state,
        type: dashActionTypes.FETCH_RESEARCHER_VIDEOS_LOADING,
      };
    case dashActionTypes.FETCH_RESEARCHER_VIDEOS_SUCCESS:
      return {
        ...state,
        type: dashActionTypes.FETCH_RESEARCHER_VIDEOS_SUCCESS,
        data: payload.data,
      };

    case dashActionTypes.FETCH_RESEARCHER_PDFS_FAILED:
      return {
        ...state,
        type: dashActionTypes.FETCH_RESEARCHER_PDFS_FAILED,
        error: payload.error,
      };

    case dashActionTypes.FETCH_RESEARCHER_PDFS_LOADING:
      return {
        ...state,
        type: dashActionTypes.FETCH_RESEARCHER_PDFS_LOADING,
      };
    case dashActionTypes.FETCH_RESEARCHER_PDFS_SUCCESS:
      return {
        ...state,
        type: dashActionTypes.FETCH_RESEARCHER_PDFS_SUCCESS,
        data: payload.data,
      };

    case dashActionTypes.FETCH_RESEARCHER_TEXTS_FAILED:
      return {
        ...state,
        type: dashActionTypes.FETCH_RESEARCHER_TEXTS_FAILED,
        error: payload.error,
      };

    case dashActionTypes.FETCH_RESEARCHER_TEXTS_LOADING:
      return {
        ...state,
        type: dashActionTypes.FETCH_RESEARCHER_TEXTS_LOADING,
      };
    case dashActionTypes.FETCH_RESEARCHER_TEXTS_SUCCESS:
      return {
        ...state,
        type: dashActionTypes.FETCH_RESEARCHER_TEXTS_SUCCESS,
        data: payload.data,
      };
    default:
      return state;
  }
};
