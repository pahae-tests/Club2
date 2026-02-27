import { useState } from "react";

export default function Test() { 
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const membres = [
    { nom: "GLISSI", prenom: "SALMA", email: "salmaglissi1@gmail.com", tel: "0648481527" },
    { nom: "ZIDANE", prenom: "ZAYNAB", email: "zaynabzidane66@gmail.com", tel: "0626396966" },
    { nom: "GANA", prenom: "ANAS", email: "anasgana2003@gmail.com", tel: "0658153409" },
    { nom: "MOUHIB", prenom: "AYOUB", email: "ayoub666mouhib@gmail.com", tel: "0636315233" },
    { nom: "CHAKRI", prenom: "AMINE", email: "amineechakri@gmail.com", tel: "0697046498" },
    { nom: "EL KASSIMI", prenom: "YOUSSEF", email: "elkassimiyoussef100@gmail.com", tel: "0613259021" },
    { nom: "RATIB", prenom: "MOHAMED", email: "ratmoh1@gmail.com", tel: "0659605327" },
    { nom: "BERRADA", prenom: "MOUNA", email: "berradamouna.05@gmail.com", tel: "0771922985" },
    { nom: "BOUCHANTOUF", prenom: "FIRDAOUSS", email: "firdaoussbouch@gmail.com", tel: "0603590220" },
    { nom: "HARAKAT", prenom: "ABDELLATIF", email: "abdellatifharakat50@gmail.com", tel: "0636243472" },
    { nom: "TAYEF", prenom: "JIHANE", email: "tayefjihane@gmail.com", tel: "0628447404" },
    { nom: "LAARIFI", prenom: "MOHAMED", email: "laarifimohamed715@gmail.com", tel: "0600496477" },
    { nom: "ZNINE", prenom: "OUMAIMA", email: "oumaimaznin1@gmail.com", tel: "0777036260" },
    { nom: "AZLAFI", prenom: "HAJAR", email: "hajarazlafi@gmail.com", tel: "0618961092" },
    { nom: "ELKASIMI", prenom: "BASMA", email: "kassumibasma17@gmail.com", tel: "0771811993" },
    { nom: "AITHIMMI", prenom: "MINA", email: "aithimmiamina2@gmail.com", tel: "0691932267" },
    { nom: "ANGAR", prenom: "YOUNESS", email: "younessangar5@gmail.com", tel: "0697652030" },
    { nom: "BOUSLAMTI", prenom: "CHOUAIB", email: "chouaibbouslamti7@gmail.com", tel: "0716705233" },
    { nom: "STIFI", prenom: "SAIDA", email: "saida27stifi@gmail.com", tel: "0773255629" },
    { nom: "IDMHAND", prenom: "SALMA", email: "idmhandsalma44@gmail.com", tel: "0777904029" },
    { nom: "ARYYAL", prenom: "NOUHAILA", email: "nohailaaryyal@gmail.com", tel: "0676612541" },
    { nom: "GOUJIL", prenom: "FATIMA EZZAHRAE", email: "goujilfaty@gmail.com", tel: "0641561045" },
    { nom: "HATTACH", prenom: "WISSAL", email: "wissalhattach@gmail.com", tel: "0620908483" },
    { nom: "HAIMEUR", prenom: "NISRINE", email: "nisrinehai@gmail.com", tel: "0658416668" },
  ];

  const insertAll = async () => {
    setLoading(true);
    let success = 0;
    let failed = 0;

    for (const m of membres) {
      try {
        const res = await fetch("/api/membres/add", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            nom: m.nom,
            prenom: m.prenom,
            email: m.email,
            tel: m.tel,
            points: 1,
            admin: false,
            dateN: null,
            ville: null,
            img: null,
          }),
        });

        if (res.ok) success++;
        else failed++;
      } catch {
        failed++;
      }
    }

    setResult({ success, failed });
    setLoading(false);
  };

  return (
    <div style={{ padding: 40 }}>
      <h1>Insertion des membres depuis le PDF</h1>

      <button
        onClick={insertAll}
        disabled={loading}
        style={{
          padding: "12px 24px",
          fontSize: 16,
          cursor: "pointer",
        }}
      >
        {loading ? "Insertion en cours..." : "Insérer tous les membres"}
      </button>

      {result && (
        <p style={{ marginTop: 20 }}>
          ✅ Succès : {result.success} <br />
          ❌ Échecs : {result.failed}
        </p>
      )}
    </div>
  );
}

