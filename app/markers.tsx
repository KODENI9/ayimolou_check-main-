const markers = [
  {
    name: "Lomé, Togo",
    coordinates: { latitude: 6.1376, longitude: 1.2123, latitudeDelta: 0.1, longitudeDelta: 0.1 },
    description: "Capitale du Togo, centre commercial et économique.",
    image: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=600&auto=format",
  },
  {
    name: "Cotonou, Bénin",
    coordinates: { latitude: 6.3654, longitude: 2.4183, latitudeDelta: 0.1, longitudeDelta: 0.1 },
    description: "Ville portuaire et capitale économique du Bénin.",
    image: "https://images.unsplash.com/photo-1541417904950-b855846fe074?w=600&auto=format",
  },
  {
    name: "Yamoussoukro, Côte d'Ivoire",
    coordinates: { latitude: 6.8276, longitude: -5.2893, latitudeDelta: 0.1, longitudeDelta: 0.1 },
    description: "Capitale politique de la Côte d’Ivoire.",
    image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=600&auto=format",
  },
  {
    name: "Accra, Ghana",
    coordinates: { latitude: 5.5680, longitude: -0.2180, latitudeDelta: 0.1, longitudeDelta: 0.1 },
    description: "Capitale du Ghana.",
    image: "https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=600&auto=format",
  },
  {
    name: "Kara, Togo",
    coordinates: { latitude: 9.5530, longitude: 1.1861, latitudeDelta: 0.1, longitudeDelta: 0.1 },
    description: "Ville du nord Togo.",
    image: "https://images.unsplash.com/photo-1500534314209-a26db0f5b8a6?w=600&auto=format",
  },
  {
    name: "Dapaong, Togo",
    coordinates: { latitude: 10.8623, longitude: 0.2076, latitudeDelta: 0.1, longitudeDelta: 0.1 },
    description: "Ville du nord Togo.",
    image: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=600&auto=format",
  },
  {
    name: "Ouagadougou, Burkina Faso",
    coordinates: { latitude: 12.3714, longitude: -1.5197, latitudeDelta: 0.1, longitudeDelta: 0.1 },
    description: "Capitale du Burkina Faso.",
    image: "https://images.unsplash.com/photo-1539683255143-73a5a899f09c?w=600&auto=format",
  },
  {
    name: "Bamako, Mali",
    coordinates: { latitude: 12.6392, longitude: -8.0029, latitudeDelta: 0.1, longitudeDelta: 0.1 },
    description: "Capitale du Mali.",
    image: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=600&auto=format",
  },
  {
    name: "Dakar, Sénégal",
    coordinates: { latitude: 14.7167, longitude: -17.4677, latitudeDelta: 0.1, longitudeDelta: 0.1 },
    description: "Capitale du Sénégal.",
    image: "https://images.unsplash.com/photo-1559925393-8be0ec4767c8?w=600&auto=format",
  },
  {
    name: "Niamey, Niger",
    coordinates: { latitude: 13.5116, longitude: 2.1254, latitudeDelta: 0.1, longitudeDelta: 0.1 },
    description: "Capitale du Niger.",
    image: "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=600&auto=format",
  },
  {
    name: "Abuja, Nigeria",
    coordinates: { latitude: 9.0579, longitude: 7.4951, latitudeDelta: 0.1, longitudeDelta: 0.1 },
    description: "Capitale du Nigeria.",
    image: "https://images.unsplash.com/photo-1500534314209-a26db0f5b8a6?w=600&auto=format",
  },
  {
    name: "Lagos, Nigeria",
    coordinates: { latitude: 6.5244, longitude: 3.3792, latitudeDelta: 0.1, longitudeDelta: 0.1 },
    description: "Plus grande ville du Nigeria.",
    image: "https://images.unsplash.com/photo-1528164344705-47542687000d?w=600&auto=format",
  },
  {
    name: "Libreville, Gabon",
    coordinates: { latitude: 0.4162, longitude: 9.4673, latitudeDelta: 0.1, longitudeDelta: 0.1 },
    description: "Capitale du Gabon.",
    image: "https://images.unsplash.com/photo-1445307806294-bff7f67ff225?w=600&auto=format",
  },
  {
    name: "Malabo, Guinée équatoriale",
    coordinates: { latitude: 3.7500, longitude: 8.7833, latitudeDelta: 0.1, longitudeDelta: 0.1 },
    description: "Capitale de la Guinée équatoriale.",
    image: "https://images.unsplash.com/photo-1512455102796-42f2ec3db8d7?w=600&auto=format",
  },
  {
    name: "Conakry, Guinée",
    coordinates: { latitude: 9.6412, longitude: -13.5784, latitudeDelta: 0.1, longitudeDelta: 0.1 },
    description: "Capitale de la Guinée.",
    image: "https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=600&auto=format",
  },
  {
    name: "Monrovia, Libéria",
    coordinates: { latitude: 6.3156, longitude: -10.8074, latitudeDelta: 0.1, longitudeDelta: 0.1 },
    description: "Capitale du Libéria.",
    image: "https://images.unsplash.com/photo-1559925393-8be0ec4767c8?w=600&auto=format",
  },
  {
    name: "Freetown, Sierra Leone",
    coordinates: { latitude: 8.4657, longitude: -13.2317, latitudeDelta: 0.1, longitudeDelta: 0.1 },
    description: "Capitale de la Sierra Leone.",
    image: "https://images.unsplash.com/photo-1445307806294-bff7f67ff225?w=600&auto=format",
  },
  {
    name: "Bissau, Guinée-Bissau",
    coordinates: { latitude: 11.8817, longitude: -15.6170, latitudeDelta: 0.1, longitudeDelta: 0.1 },
    description: "Capitale de la Guinée-Bissau.",
    image: "https://images.unsplash.com/photo-1539683255143-73a5a899f09c?w=600&auto=format",
  },
  {
    name: "Praia, Cap-Vert",
    coordinates: { latitude: 14.9330, longitude: -23.5133, latitudeDelta: 0.1, longitudeDelta: 0.1 },
    description: "Capitale du Cap-Vert.",
    image: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=600&auto=format",
  },
  {
    name: "Porto-Novo, Bénin",
    coordinates: { latitude: 6.4969, longitude: 2.6289, latitudeDelta: 0.1, longitudeDelta: 0.1 },
    description: "Capitale officielle du Bénin.",
    image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=600&auto=format",
  },
  {
    name: "Bouaké, Côte d’Ivoire",
    coordinates: { latitude: 7.6939, longitude: -5.0303, latitudeDelta: 0.1, longitudeDelta: 0.1 },
    description: "Deuxième grande ville de Côte d’Ivoire.",
    image: "https://images.unsplash.com/photo-1500534314209-a26db0f5b8a6?w=600&auto=format",
  },
  {
    name: "Takoradi, Ghana",
    coordinates: { latitude: 4.8986, longitude: -1.7603, latitudeDelta: 0.1, longitudeDelta: 0.1 },
    description: "Ville portuaire du Ghana.",
    image: "https://images.unsplash.com/photo-1512455102796-42f2ec3db8d7?w=600&auto=format",
  },
  {
    name: "Aneho, Togo",
    coordinates: { latitude: 6.2274, longitude: 1.5976, latitudeDelta: 0.1, longitudeDelta: 0.1 },
    description: "Ville côtière du Togo.",
    image: "https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=600&auto=format",
  },
  {
    name: "Sokodé, Togo",
    coordinates: { latitude: 8.9833, longitude: 1.1333, latitudeDelta: 0.1, longitudeDelta: 0.1 },
    description: "Deuxième ville du Togo.",
    image: "https://images.unsplash.com/photo-1528164344705-47542687000d?w=600&auto=format",
  }
];

export default markers;
