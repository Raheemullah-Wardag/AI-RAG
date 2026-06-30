export  const   nameformatter = name =>{
    const cleanName  =name.trim();
const FormattedName =cleanName.charAt(0).toUpperCase()+ cleanName.slice(1).toLowerCase();
return FormattedName;
}