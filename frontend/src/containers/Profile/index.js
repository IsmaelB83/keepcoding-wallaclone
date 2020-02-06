import { connect } from 'react-redux';
import { withSnackbar } from 'notistack';
// Own modules
import Profile from './Profile';
import { editUser, logout } from '../../store/actions';


/**
 * Inyecta props en mi componente para acceder al state del store
 * @param {Object} state Estado de mi store
 */
const mapStateToProps = (state) => {
    return {
        session: state.session,
        isUpdating: state.ui.isUpdating,
        error: state.ui.error,
    }
}

/**
 * Inyecta props en mi componente para acceder a los reducers del store
 * @param {Function} dispatch Dispatch del store
 */
const mapDispatchToProps = (dispatch) => {
    return {
        editUser: (user) => dispatch(editUser(user)),
        logout: () => dispatch(logout()),
    }
}

// Retorno el componente envuelto en el "connect", y en un withSnackBar (para los tags de info de la app)
export default connect(mapStateToProps, mapDispatchToProps)(withSnackbar(Profile));