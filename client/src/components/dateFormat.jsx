function calculateAge(birthday) {
    const birthDate = new Date(birthday);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
  
   
    if (
        today.getMonth() < birthDate.getMonth() ||
        (today.getMonth() === birthDate.getMonth() && today.getDate() < birthDate.getDate())
    ) {
        age--;
    }
  
    return age;
  };

  function formatDate(dateString) {
    const date = new Date(dateString);
    date.setMinutes(date.getMinutes() + date.getTimezoneOffset());
    const options = { year: '2-digit', month: '2-digit', day: '2-digit' };
    const formattedDate = date.toLocaleDateString('en-US', options);
    return formattedDate;
  };

  module.exports ={
    calculateAge,
    formatDate
  }


