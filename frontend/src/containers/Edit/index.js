// Node modules
import { connect } from 'react-redux';
import { withSnackbar } from 'notistack';
// Own components
import Edit from './Edit';
// Own modules
import { AdvertsActions, SessionActions } from '../../store/GlobalActions';

/**
 * Inyecta props en mi componente para acceder al state del store
 * @param {Object} state Estado de mi store
 */
const mapStateToProps = (state) => {
    return {
        session: state.session,
        tags: state.tags,
        ui: state.ui
    }
}

/**
 * Inyecta props en mi componente para acceder a los reducers del store
 * @param {Function} dispatch Dispatch del store
 */
const mapDispatchToProps = (dispatch) => {
    return {
        // Session
        logout: () => dispatch(SessionActions.logout()),
        // Adverts
        fetchAdvert: (slug) => dispatch(AdvertsActions.fetchAdvert(slug)),
        editAdvert: (advert) => dispatch(AdvertsActions.editAdvert(advert)),
        createAdvert: (advert) => dispatch(AdvertsActions.createAdvert(advert))
    }
}

/**
 * Envuelvo el App en al función connect para conectar con el store recibido del provider
 */ 
export default connect(mapStateToProps, mapDispatchToProps)(withSnackbar(Edit));

/*  Lo anterior es equivalente a esto. Porque uso exactamente el mismo nombre de función que en el dispatch.
    Y además uso exactamente los mismos parámetros:
    ----------------------------------------------------
    const mapDispatchToProps = {
        editAdvert,
        createAdvert
    }

    O incluso más reducido aun:
    ----------------------------------------------------
    import * as actions from '../../store/actions';
    const mapDispatchToProps = actions;
*/