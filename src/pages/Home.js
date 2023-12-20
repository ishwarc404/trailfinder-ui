import Header from './header/header'
import Searcharea from './searcharea/searcharea'


//STYLES
import './home.css';
import MapComponent from './mapcomponent/mapcomponent';



function Home() {


    return (
        <div className='home'>
            <Header />
            <br />
            <div className='d-flex justify-content-center'>
                <div>
                    <Searcharea />
                </div>
                <div>
                    <MapComponent />
                </div>

            </div>

        </div>
    );
}

export default Home;
