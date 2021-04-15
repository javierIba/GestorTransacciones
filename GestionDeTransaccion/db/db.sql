drop  database gestiondetransaccion;
create database gestiondetransaccion;
USE gestionDeTransaccion;

create table Empresas(
	rut varchar(20),
	nombre varchar(200) not null,
	nombreFantasia varchar(200) not null,
	sucursales int not null,
	nombreContacto varchar(200) not null,
	telefono varchar(20) not null,
	email varchar(200) not null,

	primary key(rut),
	check (email like '%@%.%'),
	check (rut like '%-%')
);

create table Planes(
	id INT AUTO_INCREMENT not null,
	tipo varchar (100) not null,
	primary key(id)

);


create table Vendedores(
	rut varchar(20) not null,
    nombre varchar(200) not null,
    
    primary key(rut),
    check(rut like '%-%')
);


create table infoCertificaciones(
	id INT AUTO_INCREMENT not null,
    emisionDTE  boolean not null,
    estado varchar(3) not null,
    fechaInicioBoleta date ,
    fechaFinBoleta date,
    fechaInicioFactura date,
    fechaFinFactura date,
    
    primary key(id)
);

create table transacciones(
	id INT AUTO_INCREMENT not null ,
    fechaCompra date not null,
    infoEmpresa varchar(20) not null,
    tipoPlan int not null,
    estadoCorreo boolean not null,
    infoCertificacion int not null,
    estadoSistema varchar(200),
    comentario varchar(200),
    enLinea boolean not null,
    infoVendedores varchar(20),
    
    primary key(id),
	FOREIGN KEY (infoEmpresa) REFERENCES empresas(rut) ON DELETE CASCADE,
    FOREIGN KEY (tipoPlan) REFERENCES planes(id) ON DELETE CASCADE, 
    FOREIGN KEY (infoCertificacion) REFERENCES infoCertificaciones(id) ON DELETE CASCADE,
    FOREIGN KEY (infoVendedores) REFERENCES Vendedores(rut) ON DELETE CASCADE
);