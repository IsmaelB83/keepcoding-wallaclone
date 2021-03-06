// Node modules
import { connect } from 'react-redux';
import { withSnackbar } from 'notistack';
import { withNamespaces } from 'react-i18next';
// Own Components
import SectionList from './SectionList';
// Models
// Own modules
import { AdvertsActions, SessionActions, FiltersActions, ChatActions } from '../../store/GlobalActions';


/**
 * Inyecta props en mi componente para acceder al state del store
 * @param {Object} state Estado de mi store
 */
const mapStateToProps = (state) => {
    return {
        adverts: state.adverts,
        session: state.session,
        chats: state.chats,
        ui: state.ui,
        lastCall: state.lastCall
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
        setFavorite: slug => dispatch(SessionActions.setFavorite(slug)),
        // Filters
        setCurrentPage: pageNumber => dispatch(FiltersActions.setCurrentPage(pageNumber)),
        // Adverts
        deleteAdvert: slug => dispatch(AdvertsActions.deleteAdvert(slug)),
        bookAdvert: slug => dispatch(AdvertsActions.bookAdvert(slug)),
        sellAdvert: slug => dispatch(AdvertsActions.sellAdvert(slug)),
        fetchFavorites: () => dispatch(AdvertsActions.fetchFavorites()),
        fetchUserAdverts: slug => dispatch(AdvertsActions.fetchUserAdverts(slug)),
        fetchSoldHistory: () => dispatch(AdvertsActions.fetchSoldHistory()),
        fetchIterateAdverts: direction => dispatch(AdvertsActions.fetchIterateAdverts(direction)),
        // Chats
        createChat: slug => dispatch(ChatActions.createChat(slug))
    }
}

// Envuelvo el App en al función connect para conectar con el store recibido del provider
export default connect(mapStateToProps, mapDispatchToProps)(withSnackbar(withNamespaces()(SectionList)));