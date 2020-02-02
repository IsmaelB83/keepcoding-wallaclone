// NPM Modules
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import Moment from 'react-moment';
// Material UI
import KeyboardBackspaceIcon from '@material-ui/icons/KeyboardBackspace';
import Container from '@material-ui/core/Container';
import EditIcon from '@material-ui/icons/Edit';
import Button from '@material-ui/core/Button';
import Chip from '@material-ui/core/Chip';
// Models
import Advert from '../../models/Advert'
// Components
import Loading from '../Loading';
import NavBar from '../NavBar';
import Footer from '../Footer';
import Error from '../Error';
// Assets
import imgReserved from '../../assets/images/reserved.png'
import imgSold from '../../assets/images/sold.png'
// CSS
import './styles.css';

/**
 * Main App
 */
export default function AdvertDetail(props) {
  
  const id = props.match.params.id;
  const loadAdvert = props.loadAdvert;
  const isDeleting = props.isDeleting;
  const error = props.error

  const [deleting, setDeleting] = useState(false);

  // Dispatch load advert action
  useEffect(() => {
    loadAdvert(id);
  }, [id, loadAdvert]);

  // Controlar fin de acción de borrado
  useEffect(() => {
    if (deleting && !isDeleting && !error) {
      props.enqueueSnackbar('Anuncio borrado con éxito', { variant: 'success' });
      props.history.push('/');
    } else if (deleting && !isDeleting && error) {
      props.enqueueSnackbar(error, { variant: 'error' });
    }
  }, [isDeleting]);

  // Reservar producto
  const bookAdvert = () => {
    const advert = new Advert(props.advert);
    advert.booked = !advert.booked;
    props.editAdvert(advert, props.session.jwt);
  }

  // Sell advert
  const sellAdvert = () => {
    const advert = new Advert(props.advert);
    advert.sold = !advert.sold;
    props.editAdvert(advert, props.session.jwt); 
  }

  // Delete advert
  const deleteAdvert = () => {
    setDeleting(true);
    props.deleteAdvert(props.advert._id, props.session.jwt);
  }
 
  // Render
  return (
    <React.Fragment>
      <NavBar/>
      <Container>
        <main className='Main__Section'>
          { props.advert && 
            <article className='AdvertDetail'>
              <div className='AdvertDetail__Main'>
                <header className='AdvertDetail__Header'>
                  <Link to='/' className='AdvertDetail__Back'>
                    <KeyboardBackspaceIcon/>
                  </Link>
                  <h1>{props.advert.name}</h1>
                  <img className='Caption' src={props.advert.photo} alt='caption'/>
                  { props.advert.booked && <img src={imgReserved} className='AdvertCard__Status' alt='reserved'/> }
                  { props.advert.sold && <img src={imgSold} className='AdvertCard__Status' alt='sold'/> }
                </header>
                <div className='AdvertDetail__Content'>
                  <h3 className='AdvertDetail__Type'>{props.advert.type==='buy'?'Compro':'Vendo'}</h3>
                  <div className='AdvertDetail__Description'>
                    <p>{props.advert.description}</p>
                  </div>
                  <div className='AdvertDetail__Tags'>
                  {   props.advert.tags && 
                      props.advert.tags.map((value,i) => {
                          return  <Chip
                                      key={i}
                                      size="small"
                                      label={value}
                                      className={`Ad__Tag Ad__Tag--${value}`}
                                  />
                      })
                  }
                  </div>
                  <div className='AdvertDetail__Actions'>
                    <Link to={`/advert/edit/${props.advert._id}`}>
                      <Button type='button' variant='contained' color='secondary' startIcon={<EditIcon />} className='ButtonWallakeep ButtonWallakeep__Green'>Editar</Button>
                    </Link>
                    <Button type='button' variant='contained' className='ButtonWallakeep ButtonWallakeep__Blue' disabled={props.advert.sold} onClick={bookAdvert}>
                      {!props.advert.booked?'Reservar':'Anular reserva'}
                    </Button>
                    <Button type='button' variant='contained' className='ButtonWallakeep ButtonWallakeep__Red' onClick={sellAdvert}>
                      {!props.advert.sold?'Vendido':'Anular venta'}
                    </Button>
                    <Button type='button' variant='contained' className='ButtonWallakeep ButtonWallakeep__Red' onClick={deleteAdvert}>Borrar</Button>
                  </div>
                  
                </div>
              </div>
              <div className='AdvertDetail__Footer'>
                <div className='AdvertDetail__Price'>
                  <p className='Text'>Precio</p>
                  <p className='Price'>{props.advert.price} <span>€</span></p>
                </div>
                <Moment className='AdvertDetail__Date' fromNow>{props.advert.createdAt}</Moment>
              </div>
            </article>
          }
          { props.isFetching && <Loading text={'fetching advert'}/> }
          { props.error &&  <Error error={props.error}/> }
        </main>
      </Container>
      <Footer/>
    </React.Fragment>
  );
}

AdvertDetail.propTypes = {
  advert: PropTypes.object,
  isFetching: PropTypes.bool,
  error: PropTypes.string,
}