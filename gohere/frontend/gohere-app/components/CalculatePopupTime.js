import AsyncStorage from '@react-native-async-storage/async-storage';

export default async function CalculatePopupTime() {
    //HARD CODE TIME BETWEEN REVIEWS
    const DAYS_BETWEEN_POPUPS = 3;

    try {
        const storedDate = await AsyncStorage.getItem('date');
        const currentDate = new Date();

        if (storedDate == null) { //If there is no previous date
            //Get the currentDate and store it locally as date since last popup
            await AsyncStorage.setItem('date', currentDate.toString());
            setDate(currentDate);
            //Do not show a popup
            return false;
        }
        
        /* Can be used to test whether the logic works
        const currentTest = new Date();
        const testDate = new Date();

        //If 1 or 2, popup doesn't show
        //If 3, popup shows
        const n = 3;
        testDate.setDate(currentTest.getDate() - n);

        const differenceInTimeTest = currentTest.getTime() - testDate.getTime();

        const differenceInDaysTest = Math.ceil(differenceInTimeTest / (1000 * 3600 * 24));
        return (differenceInDaysTest > 2);

        */

        //Get the difference between current date and stored date in days
        const differenceInTime = new Date(storedDate).getTime() - currentDate.getTime();
        const differenceInDays = Math.ceil(differenceInTime / (1000 * 3600 * 24));

        //It is time for a new popup
        if (differenceInDays > DAYS_BETWEEN_POPUPS) {
            //Set the date since last popup to the currentDate
            await AsyncStorage.setItem('date', currentDate);
            return true;
        } else { //Otherwise, do no show the popup
            return false;
        }
    } catch (error) {
        console.log('Error reading date from storage:', error);
        return false;
    }
}

