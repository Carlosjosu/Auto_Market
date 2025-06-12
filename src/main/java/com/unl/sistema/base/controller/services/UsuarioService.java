package com.unl.sistema.base.controller.services;

import com.unl.sistema.base.controller.dao.dao_models.DaoUsuario;
import com.unl.sistema.base.models.Usuario;
import org.springframework.stereotype.Service;

@Service
public class UsuarioService {
    private final DaoUsuario usuarioDao;

    public UsuarioService(DaoUsuario usuarioDao) {
        this.usuarioDao = usuarioDao;
    }

    public Usuario buscarPorId(Long id) {
        return usuarioDao.findById(id);
    }
}