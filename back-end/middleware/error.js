const errorHandler = (err, req, res, next) => {
  let error = "Erreur";
  let field = "Unknown";
  const errCode = err.code;
  if (errCode === "P2002") {
    const target = err.meta.target.split("_")[1];
    if (err.meta.target === "PRIMARY") {
      error = `Ce numero d'inscription éxiste déja`;
    }
    field = target;
    switch (target) {
      case "numTel":
        error = `Ce numéro téléphone éxiste déja`;

        break;
      case "numInscription":
        error = `Ce numéro numéro d'inscription éxiste déja`;
        break;
      case "cin":
        error = `Ce CIN éxiste déja`;
        break;
      case "email":
        error = `Ce email éxiste déja`;
        break;
      case "image":
        error = `Ce image éxiste déja`;
        break;
    }
  }

  if (errCode === "P2025") {
    error = "L'id n'éxiste pas";
  }

  if (errCode === "P2003") {
    error = `${err.meta.field_name} inconnu`;
  }

  res.status(err.statusCode || 500).json({
    success: false,
    error,
    field
  });
};

export default errorHandler;
