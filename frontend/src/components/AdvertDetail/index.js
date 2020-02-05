// Node modules
import { connect } from 'react-redux';
import { withSnackbar } from 'notistack';
// Own components
import AdvertDetail from './AdvertDetail';
// Own modules
import { fetchAdvert, editAdvert, deleteAdvert, likeAdvert } from '../../store/actions';


/**
 * Inyecta props en mi componente para acceder al state del store
 * @param {Object} state Estado de mi store
 */
const mapStateToProps = (state) => {
    return {
        session: state.session,
        advert: state.advert,
        isFetching: state.ui.isFetching,
        isDeleting: state.ui.isDeleting,
        isUpdating: state.ui.isUpdating,
        error: state.ui.error
    }
}

/**
 * Inyecta props en mi componente para acceder a los reducers del store
 * @param {Function} dispatch Dispatch del store
 */
const mapDispatchToProps = (dispatch) => {
    return {
        loadAdvert: (slug, likes) => dispatch(fetchAdvert(slug, likes)),
        editAdvert: (advert, jwt) => dispatch(editAdvert(advert, jwt)),
        deleteAdvert: (slug, jwt) => dispatch(deleteAdvert(slug, jwt)),
        likeAdvert: (slug, jwt) => dispatch(likeAdvert(slug, jwt))
    }
}

/**
 * Envuelvo el App en al función connect para conectar con el store recibido del provider
 */ 
export default connect(mapStateToProps, mapDispatchToProps)(withSnackbar(AdvertDetail));