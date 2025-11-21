import { useEffect, useState } from "react";

function App() {
  // State contenant tous les employés récupérés depuis l'API
  const [employees, setEmployees] = useState([]);

  // Champs du formulaire
  const [nom, setNom] = useState("");
  const [tel, setTel] = useState("");
  const [adresse, setAdresse] = useState("");

  // ID en mode modification
  const [editId, setEditId] = useState(null);

  // Controle champs
  const [errors, setErrors] = useState({});

  const API_URL = "http://localhost/phpreact/backend/api/employee.php";

  
  // CHARGER LES EMPLOYÉS

  const fetchEmployees = async () => { /// afaka tsy  mifampiancdry ilay tache
    const res = await fetch(API_URL);
    const data = await res.json();
    setEmployees(data);
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

 
  // AJOUTER OU MODIFIER
 
  /*const handleSubmit = async () => {
    const method = editId ? "PUT" : "POST";

    const payload = {
      id_emp: editId,
      nom_emp: nom,
      tel_emp: tel,
      adresse_emp: adresse,
    };

    await fetch(API_URL, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    // Réinitialiser
    setNom("");
    setTel("");
    setAdresse("");
    setEditId(null);

    fetchEmployees();
  };*/

  const handleSubmit = async () => {

    // 1️⃣ — On valide le formulaire avant d'envoyer
    if (!validateForm()) {
      return; // Stop si erreur
    }

    const method = editId ? "PUT" : "POST";

    const payload = {
      id_emp: editId,
      nom_emp: nom,
      tel_emp: tel,
      adresse_emp: adresse,
    };

    await fetch(API_URL, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    // Reset
    setNom("");
    setTel("");
    setAdresse("");
    setEditId(null);
    setErrors({});

    fetchEmployees();
  };


    // PRÉPARER MODIFICATION
    
  const editEmployee = (emp) => {
    setEditId(emp.id_emp);
    setNom(emp.nom_emp);
    setTel(emp.tel_emp);
    setAdresse(emp.adresse_emp);
  };

    // VALIDATUINKJKJHKJH
  const validateForm = () => {
    let newErrors = {};

    // Vérifier le nom
    if (!nom.trim()) {
      newErrors.nom = "Le nom est obligatoire.";
    } else if (nom.length < 2) {
      newErrors.nom = "Le nom doit contenir au moins 2 caractères.";
    }

    // Vérifier le téléphone
    if (!tel.trim()) {
      newErrors.tel = "Le numéro de téléphone est obligatoire.";
    } 
    else if (!/^[0-9]{9,14}$/.test(tel)) {
      newErrors.tel = "Numéro invalide (uniquement chiffres, 9 à 14 caractères).";
    }

    // Vérifier l'adresse
    if (!adresse.trim()) {
      newErrors.adresse = "L'adresse est obligatoire.";
    }

    setErrors(newErrors);

    // Retourne vrai si aucune erreur
    return Object.keys(newErrors).length === 0;
  };


  
  // SUPPRIMER
 
  const deleteEmployee = async (id) => {
    await fetch(`${API_URL}?id=${id}`, { method: "DELETE" });
    fetchEmployees();
  };

  return (
    <div className="p-10 max-w-3xl mx-auto">

      <h1 className="text-3xl font-bold mb-6 text-center">Gestion des Employés</h1>

      {/* FORMULAIRE */}
      <div className="bg-white shadow p-5 rounded mb-6">
        <h2 className="text-xl font-semibold mb-4">
          {editId ? "Modifier l'employé" : "Ajouter un employé"}
        </h2>

       {/*  <input
          className="border p-2 w-full mb-3"
          placeholder="Nom"
          value={nom}
          onChange={(e) => setNom(e.target.value)} required
        />

        <input
          className="border p-2 w-full mb-3"
          placeholder="Téléphone"
          value={tel}
          onChange={(e) => setTel(e.target.value)} required
        />

        <input
          className="border p-2 w-full mb-3"
          placeholder="Adresse"
          value={adresse}
          onChange={(e) => setAdresse(e.target.value)} required
        />*/}

        <input
          className={`border p-2 w-full mb-1 ${errors.nom ? "border-red-500" : ""}`}
          placeholder="Nom"
          value={nom}
          onChange={(e) => setNom(e.target.value)}
        />
        {errors.nom && <p className="text-red-500 text-sm">{errors.nom}</p>}

        <input
          className={`border p-2 w-full mb-1 ${errors.tel ? "border-red-500" : ""}`}
          placeholder="Téléphone"
          value={tel}
          onChange={(e) => setTel(e.target.value)}
        />
        {errors.tel && <p className="text-red-500 text-sm">{errors.tel}</p>}

        <input
          className={`border p-2 w-full mb-1 ${errors.adresse ? "border-red-500" : ""}`}
          placeholder="Adresse"
          value={adresse}
          onChange={(e) => setAdresse(e.target.value)}
        />
        {errors.adresse && <p className="text-red-500 text-sm">{errors.adresse}</p>}
        <button
          onClick={handleSubmit}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {editId ? "Modifier" : "Ajouter"}
        </button>
      </div>

      {/* TABLEAU  affichage des donnees*/}
      <table className="w-full border-collapse bg-white shadow rounded">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">Nom</th>
            <th className="border p-2">Tel</th>
            <th className="border p-2">Adresse</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>

        <tbody>
          {employees.map((emp) => (
            <tr key={emp.id_emp}>
              <td className="border p-2">{emp.nom_emp}</td>
              <td className="border p-2">{emp.tel_emp}</td>
              <td className="border p-2">{emp.adresse_emp}</td>

              <td className="border p-2 flex gap-2">
                <button
                  onClick={() => editEmployee(emp)}
                  className="bg-yellow-500 text-white px-3 py-1 rounded"
                >
                  Modifier
                </button>

                <button
                  onClick={() => deleteEmployee(emp.id_emp)}
                  className="bg-red-600 text-white px-3 py-1 rounded"
                >
                  Supprimer
                </button>
              </td>
            </tr>
          ))}
        </tbody>

      </table>
    </div>
  );
}

export default App;
