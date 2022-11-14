
import { Switch } from 'react-router-dom'

import Route from './Route'
import SignIn from '../pages/SignIn'
import SignUp from '../pages/SignUp'
import Profile from '../pages/profile'

import DailyMeasurements from '../pages/dailyMeasurement/index'
import DailyMeasurement from '../pages/dailyMeasurement/dailyMeasurement'
import Foods from '../pages/foods'
import Food from '../pages/foods/food'
import Medicines from '../pages/medicines'
import Medicine from '../pages/medicines/medicine'
import PhysicalActivities from '../pages/physicalActivities'
import PhysicalActivity from '../pages/physicalActivities/physicalActivity'
import SleepNights from '../pages/sleepNights'
import SleepNight from '../pages/sleepNights/sleepNight'
import Weights from '../pages/weights'
import Weight from '../pages/weights/weight'


export default function Routes() {
  return (
    <Switch>
      <Route exact path="/" component={SignIn} />
      <Route exact path="/register" component={SignUp} />
      <Route exact path="/dailyMeasurements" component={DailyMeasurements} isPrivate  />
     
      <Route exact path="/dailyMeasurement/:id" component={DailyMeasurement} isPrivate  />
      <Route exact path="/foods" component={Foods}  isPrivate />
      <Route exact path="/food/:id" component={Food}  isPrivate />
      <Route exact path="/medicines" component={Medicines}  isPrivate />
      <Route exact path="/medicine/:id" component={Medicine} isPrivate  />
      <Route exact path="/physicalActivities" component={PhysicalActivities} isPrivate  />
      <Route exact path="/physicalActivity/:id" component={PhysicalActivity} isPrivate  />
      <Route exact path="/weights" component={Weights}  isPrivate />
      <Route exact path="/weight/:id" component={Weight} isPrivate  />
      <Route exact path="/sleepNights" component={SleepNights} isPrivate  />
      <Route exact path="/sleepNight/:id" component={SleepNight} isPrivate  />
      <Route exact path="/profile" component={Profile}  isPrivate />
    </Switch>
  )
}